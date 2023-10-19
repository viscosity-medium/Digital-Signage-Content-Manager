import { Test, TestingModule } from '@nestjs/testing';
import { WebClientController } from './web-client.controller';

describe('WebClientController', () => {
  let controller: WebClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebClientController],
    }).compile();

    controller = module.get<WebClientController>(WebClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
