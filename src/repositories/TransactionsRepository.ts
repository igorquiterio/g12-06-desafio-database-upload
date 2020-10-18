import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const allTransactions = await this.find();

    const income: number = allTransactions.reduce(
      (acumulator, transaction) =>
        acumulator + (transaction.type === 'income' ? transaction.value : 0),
      0,
    );
    const outcome: number = allTransactions.reduce(
      (acumulator, transaction) =>
        acumulator + (transaction.type === 'outcome' ? transaction.value : 0),
      0,
    );
    const total: number = income - outcome;

    const totalBalance: Balance = { income, outcome, total };

    return totalBalance;
  }
}

export default TransactionsRepository;
