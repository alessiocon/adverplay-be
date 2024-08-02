import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Match, MatchSchema } from './models/Match.schema';
import { MatchService } from './Match.service';
import { MatchController } from './Match.controller';
import { CodeModule } from './../code/Code.module';
import { GeventModule } from './../gevent/Gevent.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Match.name, schema: MatchSchema }]),
    CodeModule,
    GeventModule
  ],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}

