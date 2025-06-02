
export type Constraint = '' | 'cascade' | 'null' | 'restrict'

interface Field
{
	foreign: string
	main:    string
}

interface Init
{
	onDelete: Constraint
	onUpdate: Constraint
}

export class ForeignKey implements Init
{
	fields:           Field[]
	foreignTableName: string
	name:             string
	onDelete:         Constraint = ''
	onUpdate:         Constraint = ''

	constructor(name: string, fields: Field[], foreignTableName: string, init?: Init)
	{
		this.fields           = fields
		this.foreignTableName = foreignTableName
		this.name             = name
		if (init) {
			Object.assign(this, init)
		}
	}

}
