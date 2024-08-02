import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import nodemailer from 'nodemailer';
import SMTPTransport, { MailOptions } from "nodemailer/lib/smtp-transport";
import { Email } from './models/Email.schema';
import { Model, Types} from 'mongoose';
import { EmailConfirmData, EmailTypeEnum } from './models/EmailModels';
import { ResFetch } from './../models/Response.model';
const nodemail = require("nodemailer");


@Injectable()
export class EmailService{
    #trensporter : nodemailer.Transporter<SMTPTransport.SentMessageInfo>; 
    #protocol: "http"|"https" = process.env.NODE_ENV === "development" ? "http" : "https";
    private readonly logger = new Logger();

    constructor(
      @InjectModel(Email.name) private _emailContext: Model<Email>,
    ){
        //create transporter
        this.#trensporter = nodemail.createTransport({
            service: process.env.NODEMAILER_SERVICE,
            host: process.env.NODEMAILER_HOST,
            secure: process.env.NODEMAILER_PORT === "465",
            tls: {
                ciphers: "SSLv3",
                rejectUnauthorized: false,
              },
            auth: {
                user: process.env.NODEMAILER_EMAIL, 
                pass:  process.env.NODEMAILER_PASSWORD, 
              },
        })
    }
    
    async sendMail (mail : MailOptions){
        // crea l'oggetto da trasportare
        let mailObj = {
            from: `"${mail.from}" <${process.env.NODEMAILER_EMAIL}>`, // sender address
            to: `${mail.to}`, //list of receivers 
            subject: mail.subject, // Subject line
            text: mail.text, // plain text body
            html: mail.html, // html body
        }

        return await this.#sendMailObj(mailObj)
    }

    

    async sendConfirmEmail(to : string, userId: Types.ObjectId) : Promise<ResFetch<boolean>>{
        
        const data : EmailConfirmData = {userId};
        this.logger.log(`delete email with userId ${userId} and type ${EmailTypeEnum.EmailConfirm}`);
        await this._emailContext.findOneAndDelete({type: EmailTypeEnum.EmailConfirm, data: {userId: userId}});

        let email = new this._emailContext({
          type: EmailTypeEnum.EmailConfirm,
          data,
          expireAt: Date.now() + 1000*60*15
        })

        await email.save();
        this.logger.log(`save email with userId ${userId} and type ${EmailTypeEnum.EmailConfirm}`);

        let mailObj = {
            from: `"${process.env.NODEMAILER_EMAIL}" <${process.env.NODEMAILER_EMAIL}>`, // sender address
            to: `${to}`, //list of receivers 
            subject: "AdMania conferma email", // Subject line
            html: `<div style={{textAlign:"center"}}>
                <h1>Confrema la tua mail</h1>
                <div>
                    <p>Ci siamo quasi, conferma la tua email per avere fantastici <b>vantaggi</b></p> 
                    <a title="conferma email" 
                        href="${this.#protocol}://${process.env.NODEMAILER_HOST_CLIENT}service/user/confirmemail/${email._id.toString()}"
                        style={{textAlign:"center", display:"block"}}
                    >clicca qui</a>
                </div>
            </div>`
        }

        return await this.#sendMailObj(mailObj)
    }

    async sendRecoveryPassword(to : string, userId: Types.ObjectId) : Promise<ResFetch<boolean>>{
        const data : EmailConfirmData = {userId};

        let email = new this._emailContext({
          type: EmailTypeEnum.ChangePassword,
          data,
          expireAt: Date.now() + 1000*60*10
        })
        await email.save();

        let mailObj = {
            from: `"${process.env.NODEMAILER_EMAIL}" <${process.env.NODEMAILER_EMAIL}>`, // sender address
            to: `${to}`, //list of receivers 
            subject: "Richiesta cambio password", // Subject line
            html: `<h1>Richiesta cambio password</h1><p>abbiamo ricevuto una richiesta di cambio password, <a title="cambia password" href="${process.env.NODEMAILER_HOST_CLIENT}service/user/recoverypassword/${email._id.toString()}">clicca qui per cambiare password</a></p>`, // html body
        }
        return await this.#sendMailObj(mailObj)
    }

    async getUserIdFromMail(idMail: string) : Promise<ResFetch<Types.ObjectId>>{
        let response : ResFetch<Types.ObjectId> = {}; 
        
        let emailInDb = await this._emailContext.findById(idMail);
        if(emailInDb){
            response.data = emailInDb.data.userId;
            await emailInDb.deleteOne();
        }else{
            response.error = {general: "email inviata inesistente"}
        }

        return response;
    }

    async #sendMailObj(mail: MailOptions): Promise<ResFetch<boolean>>{
        let response: ResFetch<boolean> = {data: false};

        try{
            //send mail
            await this.#trensporter.sendMail(mail);
            this.logger.log(`Sending email to ${mail.to} Successfully`);

            response.data = true;
        }catch(e){
            this.logger.error(`sending an email to ${mail.to} Failed \n ${e}`);
            response.error = {general: "errore nell\' invio dell\' email"}
        }

        return response;
    }

   
}
