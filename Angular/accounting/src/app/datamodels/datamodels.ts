// export type voucher_Type = 'sale' | 'purchase' | 'journal' | 'receipt' |'contra' |
// 'credit_note' | 'debit_note' |'delivery_note'| 'payment'

export type entry_type = 'debit' | 'credit'

export interface VoucherType {
  id?:number,
  code:string,
  name:string
}

export interface CompanyModel {
  id?: number;
  user?: number;
  name?: string;
  alias?: string;
  printName?: string;
  is_selected?: boolean;
}

export interface userAccessTokenDecode {
  token_type?: string,
  exp?: number,
  iat?: number,
  jti?: string,
  user_id?: number,
  first_name?: string,
  last_name?: string
}

export interface ledger {
  id?: number,
  code?: string,
  company: number,
  ledger_type: number,
  name: string,
  ledger_alias?: string,
  ledger_print_name?: string, 
  parent:number | null,
  parent_name?: string,
  is_pre_defined?: boolean,
  is_subgroup?: boolean
}

export interface entry {
  id?: number,
  ledger: number,
  debit: number,
  credit:number,
  narration?: string
}

export interface transaction {
  company:number,
  voucher_no?: string,
  voucher_type: number,
  voucher_name?: string,
  date: string,
  narration: string,
  entries: entry[]
}

export interface AccountTransaction {
  id: number;
  date: string;
  voucherType: string;
  voucherNo: string;
  account: string;
  amount: number;
  // entry_type: 'debit' | 'credit';
  debit:number,
  credit:number,
  narration?: string;
  balance?: number;
}


