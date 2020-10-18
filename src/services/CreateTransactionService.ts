import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import FindOrCreateCategoryService from './FindOrCreateCategoryService';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const findOrCreateCategory = new FindOrCreateCategoryService();
    const attachedCategory = await findOrCreateCategory.execute({
      title: category,
    });

    const { total }: Balance = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > total) {
      throw new AppError('Not enought credit');
    }

    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category_id: attachedCategory.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
