import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from './document.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let mockDocumentRepository: any;

  beforeEach(async () => {
    mockDocumentRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: getRepositoryToken(Document),
          useValue: mockDocumentRepository,
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
  });

  describe('create', () => {
    it('should create a new document', async () => {
      const userId = 1;
      const createDocumentDto = {
        title: 'Test Document',
        content: 'Test content',
        category: 'Academic',
      };

      const mockDocument = {
        id: 1,
        ...createDocumentDto,
        userId,
      };

      mockDocumentRepository.create.mockReturnValue(mockDocument);
      mockDocumentRepository.save.mockResolvedValue(mockDocument);

      const result = await service.create(userId, createDocumentDto);

      expect(result).toEqual(mockDocument);
      expect(mockDocumentRepository.create).toHaveBeenCalledWith({
        ...createDocumentDto,
        userId,
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated documents', async () => {
      const userId = 1;
      const mockDocuments = [
        { id: 1, title: 'Doc 1', userId },
        { id: 2, title: 'Doc 2', userId },
      ];

      mockDocumentRepository.findAndCount.mockResolvedValue([mockDocuments, 2]);

      const result = await service.findAll(userId, 1, 10);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('total');
      expect(result.data).toEqual(mockDocuments);
      expect(result.total).toBe(2);
    });
  });

  describe('findOne', () => {
    it('should return a document if found', async () => {
      const userId = 1;
      const documentId = 1;
      const mockDocument = { id: documentId, title: 'Test', userId };

      mockDocumentRepository.findOne.mockResolvedValue(mockDocument);

      const result = await service.findOne(documentId, userId);

      expect(result).toEqual(mockDocument);
    });

    it('should throw NotFoundException if document not found', async () => {
      const userId = 1;
      const documentId = 999;

      mockDocumentRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(documentId, userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a document if user owns it', async () => {
      const userId = 1;
      const documentId = 1;
      const mockDocument = { id: documentId, userId };

      mockDocumentRepository.findOne.mockResolvedValue(mockDocument);
      mockDocumentRepository.remove.mockResolvedValue(mockDocument);

      await service.remove(documentId, userId);

      expect(mockDocumentRepository.remove).toHaveBeenCalledWith(mockDocument);
    });

    it('should throw ForbiddenException if user does not own document', async () => {
      const userId = 1;
      const documentId = 1;
      const mockDocument = { id: documentId, userId: 2 }; // Different user

      mockDocumentRepository.findOne.mockResolvedValue(mockDocument);

      await expect(service.remove(documentId, userId)).rejects.toThrow(ForbiddenException);
    });
  });
});
