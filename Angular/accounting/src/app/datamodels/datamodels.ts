export type voucher_Type = 'sale' | 'purchase' | 'journal' | 'receipt' |'contra' |
'credit_note' | 'debit_note' |'delivery_note'| 'payment'

export type entry_type = 'debit' | 'credit'

export interface CompanyModel {
  id?: number;
  user?: number;
  company_name?: string;
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
  entry_type: entry_type,
  amount: number,
  narration?: string
}

export interface transaction {
  voucher_no: string,
  voucher_type: voucher_Type,
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
  entry_type: 'debit' | 'credit';
  narration?: string;
  balance?: number;
}


