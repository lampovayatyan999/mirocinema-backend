import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryClientGrpc } from './category.grpc';
import { GrpcModule } from '@mirocinema/common';

@Module({
  imports: [
    GrpcModule.register(['CATEGORY_PACKAGE'])
  ],
  controllers: [CategoryController],
  providers: [CategoryClientGrpc],
  exports: [CategoryClientGrpc]
})
export class CategoryModule {}
