import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
	public getHello() {
		return {message: 'Welcome to MiroCinema API'}
	}

	public healt() {
		return {
			status: 'ok',
			timestamp: new Date().toISOString()
		}
	}
}
