import { Type } from './type'

interface Init
{
	autoIncrement?: boolean
	canBeNull?:     boolean
	default?:       null | number | string | Date
	formerNames?:   string[]
}

export class Column implements Init
{
	autoIncrement: boolean = false
	canBeNull:     boolean = false
	default?:      null | number | string | Date
	formerNames:   string[] = []
	name:          string
	type:          Type

	constructor(name: string, type: Type, init?: Init)
	{
		this.name = name
		this.type = type
		if (init) {
			Object.assign(this, init)
		}
		this.cleanupDefault()
	}

	cleanupDefault()
	{
		if ((this.default === undefined) || (this.default === null)) {
			if ((this.default === null) && !this.canBeNull) {
				this.default = undefined
			}
			return
		}
		switch (this.type.name) {
			case 'date':
			case 'datetime':
				if (!(this.default instanceof Date)) {
					this.default = new Date(this.default)
				}
				return
			case 'float':
			case 'integer':
			case 'timestamp':
			case 'year':
				if (typeof this.default !== 'number') {
					this.default = +this.default
				}
				return
			case 'string':
				if (typeof this.default !== 'string') {
					this.default = '' + this.default
				}
				return
		}
	}

}
