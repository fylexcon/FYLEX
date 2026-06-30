import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { LfgController } from './lfg.controller';
import { LfgService } from './lfg.service';

@Module({
  imports: [AuthModule],
  controllers: [LfgController],
  providers: [LfgService]
})
export class LfgModule {}
