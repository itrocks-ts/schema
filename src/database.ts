
interface Init
{
	collate?: string
}

export class Database implements Init
{
	collate?: string
	name:     string

	constructor(name: string, init: Init)
	{
		this.name = name
		if (init) {
			Object.assign(this, init)
		}
	}

}
