import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';

import AppError from '../errors/AppError';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const didDelete = await transactionsRepository.delete(id);
    if (!didDelete) {
      throw new AppError('canot delete inexistent transaction');
    }
  }
}

export default DeleteTransactionService;
