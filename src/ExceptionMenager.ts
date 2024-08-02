import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ResFetch } from './models/Response.model';
  
@Catch()
export class ExceptionMenager implements ExceptionFilter {
  catch(exc: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    //const status = exception.getStatus(); for httpexception
    let excRes : ResFetch<boolean> = {data:false, error:{}};
    let status : HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    switch(exc.constructor.name){
        case "MongoServerError":
            switch(exc.code){
                case 11000:
                    excRes.error[Object.keys(exc.keyPattern)[0]] = "Valore già in uso";
                    status = HttpStatus.BAD_REQUEST;
                break
                default:
                    excRes.error = {general: "errore al db"}
            }
            break
        default:
            if(exc?.response?.error?.validationPipe){
                excRes = exc.response;
                status = exc.status;
            }else{
                if(exc?.response?.customObject){
                    let {customObject, ...res} = exc.response;
                    excRes.error = res;
                }else{
                    excRes.error = {general: exc.message}
                }
                status = exc?.status ?? status;
            }
    }

    return response
      .status(status)
      .json(excRes);
  }
}