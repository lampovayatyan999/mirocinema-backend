import { Injectable } from "@nestjs/common";
import * as Handlers from 'handlebars';
import * as path from 'path'
import * as fs from 'fs'

@Injectable()
export class TemplateService {
    private cache = new Map<string, Handlers.TemplateDelegate>()

    public async render(templateName: string, context?: Record<string, any>) {
        if(!this.cache.has(templateName)) {
            const templatePath = path.join(process.cwd(), 'src/infrastructure/mail/templates', `${templateName}.hbs`)

            const file = fs.readFileSync(templatePath, 'utf-8')

            this.cache.set(templateName, Handlers.compile(file))
        }

        const template = this.cache.get(templateName)

        return  template!(context)
    }
}