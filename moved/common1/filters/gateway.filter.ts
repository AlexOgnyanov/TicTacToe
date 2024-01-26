import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(WsException, HttpException)
export class WebsocketExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: WsException | HttpException, host: ArgumentsHost) {
    const args = host.getArgs();
    const error =
      exception instanceof WsException
        ? exception.getError()
        : exception.getResponse();

    const details = error instanceof Object ? { ...error } : { message: error };

    if ('function' === typeof args[args.length - 1]) {
      const ACKCallback = args.pop();
      ACKCallback({ ...details, data: null });
    }
  }
}
