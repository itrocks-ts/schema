
export type KeyType = 'key' | 'btree' | 'fulltext' | 'spatial' | 'unique'

export class IndexKey
{

	constructor(
		public columnName: string,
		public length?:    number
	) {}

}
