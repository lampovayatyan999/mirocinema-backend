import './observability/tracing'

import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './core/app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { getCorsConfig, getValidationPipeConfig } from './core/config'
import { GrpcExceptionFilter } from './shared/filters'
import cookieParser, * as CookieParser from 'cookie-parser'


async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const config = app.get(ConfigService)
	const logger = new Logger()

	app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')))

	app.useGlobalPipes(new ValidationPipe(getValidationPipeConfig()))

	app.useGlobalFilters(new GrpcExceptionFilter())

	app.enableCors(getCorsConfig(config))

	const swaggerConfig = new DocumentBuilder().setTitle('MiroCinema API').setDescription('API GATEWAY for mirocinema microservice').setVersion('1.0.0').addBearerAuth().build()

	const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)

	SwaggerModule.setup('/docs', app, swaggerDocument, {
		yamlDocumentUrl: '/openapi.yaml',
		swaggerOptions: {
			persistAuthorization: true
		}
	})

	const port = config.getOrThrow<number>('HTTP_PORT')
	const host = config.getOrThrow<string>('HTTP_HOST')

	await app.listen(port)

	logger.log(`Gateway started: ${host}`)
	logger.log(`Swagger started: ${host}/docs`)
}
bootstrap()
