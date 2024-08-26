import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import nodemailer from 'nodemailer';
import SMTPTransport, { MailOptions } from "nodemailer/lib/smtp-transport";
import { Email } from './models/Email.schema';
import { Model, mongo, Types} from 'mongoose';
import { EmailChangeData, EmailConfirmData, EmailTypeEnum, EmailData } from './models/EmailModels';
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
        this.#trensporter = nodemail.createTransport({
            host: process.env.NODEMAILER_HOST,
            port: process.env.NODEMAILER_PORT,
            secure: process.env.NODEMAILER_SECURE ?? false,
            requireTLS: process.env.NODEMAILER_REQUIRETLS,
            auth: {
                user: process.env.NODEMAILER_USERNAME, 
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
        
        const data : EmailConfirmData = {userId: new mongo.ObjectId(userId.toString())};
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
            subject: "AdverPlayer conferma email", // Subject line
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

    async sendChangeEmail(to : string, userId: Types.ObjectId) : Promise<ResFetch<boolean>>{
        
        const data : EmailChangeData = {userId : new mongo.ObjectId(userId.toString()), newEmail: to};
        this.logger.log(`delete email with userId ${userId} and type ${EmailTypeEnum.EmailChange}`);
        await this._emailContext.findOneAndDelete({type: EmailTypeEnum.EmailChange, data: {userId: userId}});

        let email = new this._emailContext({
          type: EmailTypeEnum.EmailChange,
          data,
          expireAt: Date.now() + 1000*60*15
        })

        await email.save();
        this.logger.log(`save email with userId ${userId} and type ${EmailTypeEnum.EmailChange}`);

        let mailObj = {
            from: `"${process.env.NODEMAILER_EMAIL}" <${process.env.NODEMAILER_EMAIL}>`, // sender address
            to: `${to}`, //list of receivers 
            subject: "AdverPlayer richiesta cambio email", // Subject line
            html: `<div style={{textAlign:"center"}}>
                <h1>Confrema il cambio della tua email</h1>
                <div>
                    <p>Ci siamo quasi, conferma il cambio della tua email</p> 
                    <a title="conferma email" 
                        href="${this.#protocol}://${process.env.NODEMAILER_HOST_CLIENT}service/user/changeemail/${email._id.toString()}"
                        style={{textAlign:"center", display:"block"}}
                    >clicca qui</a>
                </div>
            </div>`
        }

        return await this.#sendMailObj(mailObj)
    }

    async sendRecoveryPassword(to : string, userId: Types.ObjectId) : Promise<ResFetch<boolean>>{
        const data : EmailConfirmData = {userId: new mongo.ObjectId(userId.toString())};

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
            html: `<h1>Richiesta cambio password</h1><p>abbiamo ricevuto una richiesta di cambio password, <a title="cambia password" 
                href="${this.#protocol}://${process.env.NODEMAILER_HOST_CLIENT}service/user/recoverypassword/${email._id.toString()}">clicca qui per cambiare password</a></p>`, // html body
        }
        return await this.#sendMailObj(mailObj)
    }

    async getUserIdByMail(idMail: string) : Promise<ResFetch<Types.ObjectId>>{
        let response : ResFetch<Types.ObjectId> = {}; 
        
        let emailInDb = await this._emailContext.findById(new mongo.ObjectId(idMail.toString()));
        if(emailInDb){
            response.data = (emailInDb.data as EmailConfirmData).userId;
            await emailInDb.deleteOne();
        }else{
            response.error = {general: "email inviata inesistente"}
        }

        return response;
    }

    async getEmailById(idMail: string) : Promise<ResFetch<Email>>{
        let response : ResFetch<Email> = {}; 
        
        let emailInDb = await this._emailContext.findById(new mongo.ObjectId(idMail.toString()));
        if(emailInDb){
            response.data = emailInDb;
        }else{
            response.error = {general: "email inviata inesistente"}
        }

        return response;
    }

    async deleteEmailById(idMail: string): Promise<ResFetch<boolean>>{
        let response : ResFetch<boolean> = { data: false}; 
        
        let emailInDb = await this._emailContext.findByIdAndDelete(idMail);
        console.log("risultato cancellazione email", emailInDb)
        if(emailInDb){
            response.data = true;
        }else{
            response.error = {general: "email non trovata inesistente"}
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
            response.error = {general: "errore nell\' invio della mail"}
        }

        return response;
    }

   
}

