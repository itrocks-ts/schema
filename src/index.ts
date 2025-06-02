import { IndexKey } from './index-key'

export type IndexType = 'key' | 'primary' | 'unique'

interface Init
{
	type?:   IndexType
	unique?: boolean
}

export class Index implements Init
{
	public keys: IndexKey[]
	public name: string
	public type: IndexType = 'key'
	public unique = false

	constructor(name: string, keys: IndexKey[] = [], init?: Init)
	{
		this.keys = keys
		this.name = name
		if (init) {
			Object.assign(this, init)
		}
	}

}
