import { Column }     from './column'
import { ForeignKey } from './foreign-key'
import { Index }      from './index'

interface Init
{
	collation?:   string
	columns?:     Column[]
	engine?:      string
	foreignKeys?: ForeignKey[]
	indexes?:     Index[]
}

export class Table implements Init
{
	collation:   string       = ''
	columns:     Column[]     = []
	engine:      string       = ''
	foreignKeys: ForeignKey[] = []
	indexes:     Index[]      = []
	name:        string

	constructor(name: string, init?: Init)
	{
		this.name = name
		if (init) {
			Object.assign(this, init)
		}
	}

}
