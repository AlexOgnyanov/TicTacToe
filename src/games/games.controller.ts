// import { Controller, Post, UseGuards, Req, Get, Param } from '@nestjs/common';
// import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

// import { GamesService } from './games.service';

// import { AdminAuthGuard, AuthGuard } from '@/auth/guards';
// import { RequestWithUserDto } from '@/auth/dtos';

// @ApiTags('Games')
// @ApiBearerAuth('AccessToken')
// @UseGuards(AuthGuard)
// @Controller('games')
export class GamesController {
  // constructor(private readonly gamesService: GamesService) {}
  // @UseGuards(AuthGuard)
  // @Post()
  // async create(@Req() req: RequestWithUserDto) {
  //   return await this.gamesService.create(req.user.sub);
  // }
  // @UseGuards(AuthGuard)
  // @Post('join/:gameId')
  // async joinGame(
  //   @Req() req: RequestWithUserDto,
  //   @Param('gameId') gameId: string,
  // ) {
  //   console.log(gameId);
  //   return await this.gamesService.joinGame(req.user.sub, gameId);
  // }
  // @UseGuards(AdminAuthGuard)
  // @Get('all')
  // async findAll() {
  //   return this.gamesService.findAll();
  // }
  // // @Get('pending')
  // // async getPending(@Req() req: RequestWithUserDto) {
  // //   return await this.gamesService.getPending(req.user.sub);
  // // }
  // // @UseGuards(AdminAuthGuard)
  // // @Get()
  // // findAll() {
  // //   return this.gamesService.findAll();
  // // }
  // // @UseGuards(AdminAuthGuard)
  // // @Get(':id')
  // // findOne(@Param('id') id: string) {
  // //   return this.gamesService.findOne(+id);
  // // }
}
