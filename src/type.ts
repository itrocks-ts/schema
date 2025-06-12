
interface Init
{
	collate?:        string
	length?:         number
	precision?:      number
	signed?:         boolean
	values?:         string[]
	variableLength?: boolean
	zeroFill?:       boolean
}

export type TypeName = 'bit' | 'boolean' | 'blob' | 'date' | 'datetime' | 'decimal' | 'enum' | 'float' | 'integer'
	| 'set' | 'string' | 'time' | 'timestamp' | 'year'

export class Type implements Init
{
	collate?:       string
	length?:        number
	name:           TypeName
	precision?:     number
	signed?:        boolean
	values?:        string[]
	variableLength: boolean = false
	zeroFill?:      boolean

	constructor(name: TypeName, init?: Init)
	{
		this.name = name
		if (init) {
			Object.assign(this, init)
		}
	}

	static bit(length: number)
	{
		return new Type('bit', { length })
	}

	static binary(length: number, variableLength = false)
	{
		return new Type('blob', { length, variableLength })
	}

	static date()
	{
		return new Type('date')
	}

	static dateTime()
	{
		return new Type('datetime')
	}

	static decimal(length: number, precision: number, signed = true)
	{
		return new Type('decimal', { length, precision, signed })
	}

	static enum(...values: string[])
	{
		return new Type('enum', { values })
	}

	static float(precision: number, signed = true)
	{
		return new Type('float', { precision, signed })
	}

	static integer(length: number, signed = true)
	{
		return new Type('integer', { length, signed })
	}

	static set(...values: string[])
	{
		return new Type('set', { values })
	}

	static string(length: number, variableLength = false, collate?: string )
	{
		return new Type('string', { collate, length, variableLength })
	}

	static time()
	{
		return new Type('time')
	}

	static timestamp()
	{
		return new Type('timestamp')
	}

	static year()
	{
		return new Type('year')
	}

}
