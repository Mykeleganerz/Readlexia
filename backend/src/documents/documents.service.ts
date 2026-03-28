import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
  ) {}

  async create(userId: number, createDocumentDto: CreateDocumentDto): Promise<Document> {
    const document = this.documentsRepository.create({
      ...createDocumentDto,
      userId,
      category: createDocumentDto.category || 'General',
    });
    return this.documentsRepository.save(document);
  }

  async findAll(userId: number, page = 1, limit = 10): Promise<{ data: Document[]; total: number; page: number; lastPage: number }> {
    const [data, total] = await this.documentsRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: number, userId: number): Promise<Document> {
    const document = await this.documentsRepository.findOne({
      where: { id, userId },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return document;
  }

  async update(id: number, userId: number, updateDocumentDto: UpdateDocumentDto): Promise<Document> {
    const document = await this.findOne(id, userId);

    if (document.userId !== userId) {
      throw new ForbiddenException('You do not have permission to update this document');
    }

    Object.assign(document, updateDocumentDto);
    return this.documentsRepository.save(document);
  }

  async remove(id: number, userId: number): Promise<void> {
    const document = await this.findOne(id, userId);

    if (document.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this document');
    }

    await this.documentsRepository.remove(document);
  }
}
