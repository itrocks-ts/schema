
interface Init
{
	collate?:        string
	length?:         number
	maxValue?:       bigint | number | string | Date
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
	collate?:        string
	length?:         number
	maxValue?:       bigint | number | string | Date
	name:            TypeName
	precision?:      number
	signed?:         boolean
	values?:         string[]
	variableLength = false
	zeroFill       = false

	constructor(name: TypeName, init?: Init)
	{
		this.name = name
		if (init) {
			Object.assign(this, init)
		}
	}

	static bit(length: number, options?: Init)
	{
		const type = new Type('bit', { length })
		return options ? Object.assign(type, options) : type
	}

	static binary(length: number, variableLength = false, options?: Init)
	{
		const type = new Type('blob', { length, variableLength })
		return options ? Object.assign(type, options) : type
	}

	static date(options?: Init)
	{
		const type = new Type('date')
		return options ? Object.assign(type, options) : type
	}

	static dateTime(options?: Init)
	{
		const type = new Type('datetime')
		return options ? Object.assign(type, options) : type
	}

	static decimal(length: number, precision: number, signed = true, options?: Init)
	{
		const type = new Type('decimal', { length, precision, signed })
		return options ? Object.assign(type, options) : type
	}

	static enum(values: string[], options?: Init)
	{
		const type = new Type('enum', { values })
		return options ? Object.assign(type, options) : type
	}

	static float(precision: number, signed = true, options?: Init)
	{
		const type = new Type('float', { precision, signed })
		return options ? Object.assign(type, options) : type
	}

	static integer(maxValue?: bigint | number, signed = true, options?: Init)
	{
		const type = new Type('integer', { maxValue, signed })
		return options ? Object.assign(type, options) : type
	}

	static set(values: string[], options?: Init)
	{
		const type = new Type('set', { values })
		return options ? Object.assign(type, options) : type
	}

	static string(length: number, variableLength = false, collate?: string, options?: Init)
	{
		const type = new Type('string', { collate, length, variableLength })
		return options ? Object.assign(type, options) : type
	}

	static time(options?: Init)
	{
		const type = new Type('time')
		return options ? Object.assign(type, options) : type
	}

	static timestamp(options?: Init)
	{
		const type = new Type('timestamp')
		return options ? Object.assign(type, options) : type
	}

	static year(options?: Init)
	{
		const type = new Type('year')
		return options ? Object.assign(type, options) : type
	}

}
