import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { AddCodeResDto, CreateCodeReqDto, GetCodeDto } from "./models/Code.dto"
import { InjectModel } from '@nestjs/mongoose';
import { Code, CodeSchema } from './models/Code.schema';
import mongoose, { Model, ObjectId, Schema } from 'mongoose';
import { GeventService } from './../gevent/Gevent.service';
import { ResFetch } from './../models/Response.model';
import { Gevent, GeventSchema} from './../gevent/models/Gevent.schema';
import { JwtUserDto } from './../user/models/User.dto';
import { User, UserSchema } from './../user/models/User.schema';

@Injectable()
export class CodeService {
  constructor(@InjectModel(Code.name) private _codeContext: Model<Code>,
    @Inject(forwardRef(() => GeventService)) private _geventService: GeventService
  ) {}
  
  async Create(createCodeDto: CreateCodeReqDto) : Promise<ResFetch<string>>{
    let res : ResFetch<string> = {};

    let gevent = await this._geventService.FindById(createCodeDto.idGevent);
    if(gevent.data?.staff?.includes(createCodeDto.idCreator) || 
      gevent.data?.master.includes(createCodeDto.idCreator)
    ){
      let  createCode = new this._codeContext({
        code: this.GenerateCode(),
        ...createCodeDto
      });
      
      await createCode.save();
      res.data = createCode.code;
    }else{
      res.error = {general: "Non puoi creare codici in questo evento"}
    }
    
    return res;
  }

  async FindById(idCode: mongoose.Types.ObjectId) : Promise<ResFetch<Code>>{
    let res : ResFetch<Code> = {};

    res.data = await this._codeContext.findById( idCode );
      // .populate<{"idGevent": Gevent}>(CodeSchema.paths.idGevent.path, GeventSchema.paths._id.path)
      // .populate<{"idPlayer": User}>(CodeSchema.paths.idPlayer.path, UserSchema.paths._id.path);

      if(!res.data){
        res.error = {
          general: "Codice non trovato",
          game: "Codice non trovato"
        }
      }
      return res;
  }

  async Update(code : Code) : Promise<ResFetch<boolean>> {
    let res : ResFetch<boolean> = {data: true};
    let {_id, ...codeDate} = code;

    await this._codeContext.findOneAndUpdate({_id}, codeDate);
    return res;
  } 

  async AssignCode(code: string/*, user: JwtUserDto*/) : Promise<ResFetch<AddCodeResDto>>{
    let res : ResFetch<AddCodeResDto> = {};
    let codeDb = await this._codeContext.findOne({code: code})
      .populate<{"idGevent": Gevent}>(CodeSchema.paths.idGevent.path, GeventSchema.paths.scoreToWin.path);

    if(!codeDb){
      res.error = {
        code: "codice non trovato",
        game: "codice non trovato"
      }

    }/*else if(codeDb.idPlayer !== null && codeDb.idPlayer.toString() !== user._id.toString()){
      res.error = {
        code: "codice già in uso",
        game:"codice già in uso"
      }

    }*/else{
      codeDb.idPlayer = null;
      await codeDb.save();

      let codeRes : AddCodeResDto = {
        _id: codeDb._id.toString(),
        code: codeDb.code,
        try: codeDb.try,
        maxTry: codeDb.maxTry,
        //idPlayer: codeDb.idPlayer.toString(),
        scoreToWin: codeDb.idGevent.scoreToWin
      }

      res.data = codeRes;
    }
    
    return res;
  }

  async GetCodeById(codeId: mongoose.Types.ObjectId) : Promise<ResFetch<GetCodeDto>>{
    let res : ResFetch<GetCodeDto> = {};

    
    let codeDb = await  this._codeContext.findById( codeId )
      .populate<{"idGevent": Gevent}>(CodeSchema.paths.idGevent.path, GeventSchema.paths.scoreToWin.path)
      //.populate<{"idPlayer": User}>(CodeSchema.paths.idPlayer.path, UserSchema.paths.username.path);
    if(!codeDb){
      res.error = {
        general: "Codice non trovato",
        game: "Codice non trovato"
      }
    }else if(codeDb.idGevent === null){
      res.error = {
        general: "Evento non trovato o cancellato",
        game: "Evento non trovato o cancellato"
      }
    }/*else if(codeDb.idPlayer === null){
      res.error = {
        general: "Utente non trovato",
      }
    }*/else{
      let getCode: GetCodeDto = {
        code: codeDb.code,
        try: codeDb.try,
        maxTry: codeDb.maxTry,
        player: /*codeDb?.idPlayer?.username ?? ""*/null,
        scoreToWin: codeDb.idGevent.scoreToWin
      }
      res.data = getCode
    }

    return res;
  }

  async CanPlay(idCode: mongoose.Types.ObjectId, idUser: mongoose.Types.ObjectId) : Promise<ResFetch<boolean>> {
    let res : ResFetch<boolean> = {data: false};

    let codeDb = await  this._codeContext.findById(idCode)
      //.populate<{"idGevent": Gevent }>(CodeSchema.paths.idGevent.path)
      ;
    if(!codeDb) {
      res.error = {
        general: "Codice non trovato",
        game: "Codice non trovato, il codice inserito può essere scaduto inseriscine un altro"
      }
      return res;
    }

    if(codeDb.idPlayer.toString() !== idUser.toString()) {
      res.error = {
        general: "Permesso al codice negato",
        game: "Permesso al codice negato"
      }
      return res;
    }

    if(codeDb.maxTry <= codeDb.try){
      res.error = {
        general: "hai superato i tentativi a disposizione",
        game: "hai utilizzato tutti le vite, per continuare cambia codice"
      };
      return res;
    }

    res.data = true;
    return res;
    /*else if(codeDb.idGevent === null){
      res.error = {
        general: "Evento non trovato o cancellato",
        game: "Evento non trovato o cancellato"
      }

    }*/
      /*else{
        res.data = true;
        codeDb.idGevent.runGame += 1;
        await this._geventService.Update(codeDb.idGevent);
        codeDb.try += 1;
        await codeDb.save();
      }*/
  }

  async CheckWin(idCode: Schema.Types.ObjectId, score: number) : Promise<ResFetch<boolean>> {
    let res : ResFetch<boolean> = {data: false};

    let codeDb = await  this._codeContext.findById(idCode)
      .populate<{"idGevent": Gevent }>(CodeSchema.paths.idGevent.path, GeventSchema.paths.scoreToWin.path);

    if(!codeDb){
      res.error = {
        general: "Codice non trovato",
        game: "Codice non trovato, il codice inserito può essere scaduto inseriscine un altro"
      }

    }else if(codeDb.idGevent === null){
      res.error = {
        general: "Evento non trovato o cancellato",
        game: "Evento non trovato o cancellato"
      }

    }else{
      res.data = codeDb.idGevent.scoreToWin <= score;
    }

    return res;
  }



  

  findAll() {
    return `This action returns all code`;
  }

  findOne(id: number) {
    return `This action returns a #${id} code`;
  }

  async UpdateTry(id: Schema.Types.ObjectId, tryValue: number) {
    let res : ResFetch<boolean> = {data: true};

    let codeDb = await this._codeContext.findById(id);
    codeDb.try = tryValue;
    await codeDb.save();

    return res;
  }

  async Remove(codeId: ObjectId) : Promise<ResFetch<boolean>> {
    let res : ResFetch<boolean> = {data:true}
    await this._codeContext.findByIdAndDelete(codeId);

    return res;
  }

  private GenerateCode() : string {
    let alphabet = ['A', 'B', 'C', 'D', 'E', 'F','G', 'H', 'I', 'J', 'K', 'L','M', 'N', 'O', 'P', 'Q', 'R','S', 'T', 'U', 'V', 'W', 'X','Y', 'Z']

    let code = ( alphabet[Math.floor(Math.random() * (26 - 0 + 1) + 0)] ?? 'A')
      + (Math.floor(Math.random() * 10) + 10) 
      + (alphabet[Math.floor(Math.random() * (26 - 0 + 1) + 0)] ?? 'V')
      + (Math.floor(Math.random() * 10) + 10);


    return code;
  }
}
