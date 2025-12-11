[![npm version](https://img.shields.io/npm/v/@itrocks/schema?logo=npm)](https://www.npmjs.org/package/@itrocks/schema)
[![npm downloads](https://img.shields.io/npm/dm/@itrocks/schema)](https://www.npmjs.org/package/@itrocks/schema)
[![GitHub](https://img.shields.io/github/last-commit/itrocks-ts/schema?color=2dba4e&label=commit&logo=github)](https://github.com/itrocks-ts/schema)
[![issues](https://img.shields.io/github/issues/itrocks-ts/schema)](https://github.com/itrocks-ts/schema/issues)
[![discord](https://img.shields.io/discord/1314141024020467782?color=7289da&label=discord&logo=discord&logoColor=white)](https://25.re/ditr)

# schema

Structured representation of RDB databases, including tables, columns, indexes, constraints.

*This documentation was written by an artificial intelligence and may contain errors or approximations.
It has not yet been fully reviewed by a human. If anything seems unclear or incomplete,
please feel free to contact the author of this package.*

## Installation

```bash
npm i @itrocks/schema
```

## Usage

`@itrocks/schema` provides a small set of classes that describe the structure
of a relational database in memory:

- `Database` – the database itself (name and default collation),
- `Table` – a table with columns, indexes and foreign keys,
- `Column` – a column, its type and default value,
- `Type` – the SQL type of a column,
- `Index` / `IndexKey` – indexes and their constituent keys,
- `ForeignKey` – relationships between tables.

You typically use these classes as a common schema model shared across
multiple tools:

- to **build a schema from reflection or metadata** (e.g. with
  `@itrocks/reflect-to-schema`),
- to **inspect a live database and convert it into a schema** (e.g. with
  `@itrocks/mysql-to-schema`),
- to **compare two versions of a schema** (e.g. with `@itrocks/schema-diff`),
- to **generate SQL DDL** (e.g. with `@itrocks/schema-to-mysql`).

The examples below show how to create and manipulate a schema directly using
this package only.

### Minimal example

Create a single table with a primary key and a couple of typed columns:

```ts
import { Column, Index, IndexKey, Table, Type } from '@itrocks/schema'

// Define the table structure
const userTable = new Table('user', {
  columns: [
    new Column('id',   Type.integer(undefined, true), { autoIncrement: true }),
    new Column('name', Type.string(255, true)),
    new Column('age',  Type.integer(200, true, { canBeNull: true })),
  ],
  indexes: [
    new Index('PRIMARY', new IndexKey('id'), { type: 'primary', unique: true })
  ]
})
```

You now have an in-memory representation of the `user` table that you can
pass to other utilities, serialize, or inspect in your own code.

### Complete example: two related tables

The following example defines a tiny schema with `user` and `post` tables,
including a foreign key relationship and a couple of indexes.

```ts
import {
  Column,
  Database,
  ForeignKey,
  Index,
  IndexKey,
  Table,
  Type
} from '@itrocks/schema'

// 1. Define the database
const blogDb = new Database('blog', { collate: 'utf8mb4_general_ci' })

// 2. Define tables
const userTable = new Table('user', {
  collation: blogDb.collate!,
  engine:    'InnoDB',
  columns: [
    new Column('id',   Type.integer(undefined, true), {
      autoIncrement: true,
      canBeNull:     false
    }),
    new Column('name', Type.string(191, true, 'utf8mb4_general_ci'), {
      canBeNull: false
    }),
    new Column('email', Type.string(191, true, 'utf8mb4_general_ci'), {
      canBeNull: false
    })
  ],
  indexes: [
    new Index('PRIMARY', new IndexKey('id'), { type: 'primary', unique: true }),
    new Index('idx_user_email', new IndexKey('email'), { type: 'unique', unique: true })
  ]
})

const postTable = new Table('post', {
  collation: blogDb.collate!,
  engine:    'InnoDB',
  columns: [
    new Column('id',      Type.integer(undefined, true), {
      autoIncrement: true,
      canBeNull:     false
    }),
    new Column('user_id', Type.integer(undefined, true), {
      canBeNull: false
    }),
    new Column('title',   Type.string(255, true, 'utf8mb4_general_ci'), {
      canBeNull: false
    }),
    new Column('created_at', Type.dateTime(), {
      canBeNull: false,
      default:   new Date()
    })
  ],
  indexes: [
    new Index('PRIMARY', new IndexKey('id'), { type: 'primary', unique: true }),
    new Index('idx_post_user', new IndexKey('user_id'))
  ],
  foreignKeys: [
    new ForeignKey(
      'fk_post_user',
      [{ main: 'user_id', foreign: 'id' }],
      'user',
      { onDelete: 'cascade', onUpdate: 'cascade' }
    )
  ]
})

// You can now pass `userTable` and `postTable` to other @itrocks/* tools
// to generate SQL, compare schemas or keep the database in sync.
```

## API

The package exposes the following types and classes from its main entry
point:

```ts
export * from './column'
export * from './database'
export * from './foreign-key'
export * from './index'
export * from './index-key'
export * from './table'
export * from './type'
```

Below is a user‑oriented overview of each symbol.

### `class Database`

Represents a database container.

#### Constructor

```ts
new Database(name: string, init?: { collate?: string })
```

- `name` – database name (e.g. `blog`).
- `init.collate` – default collation for the database
  (e.g. `utf8mb4_general_ci`).

#### Properties

- `name: string` – database name.
- `collate?: string` – optional collation.

Typical usage: pass the collation down to tables that belong to the same
database.

---

### `type TypeName`

```ts
type TypeName =
  | 'bit'
  | 'boolean'
  | 'blob'
  | 'date'
  | 'datetime'
  | 'decimal'
  | 'enum'
  | 'float'
  | 'integer'
  | 'set'
  | 'string'
  | 'time'
  | 'timestamp'
  | 'year'
```

Union of all supported logical column types.

You rarely use `TypeName` directly; instead you work with the `Type` class
and its static constructors.

---

### `class Type`

Describes the SQL type of a column: basic family (`integer`, `string`,
`datetime`, …) plus additional options (length, precision, collation, etc.).

#### Constructor

```ts
new Type(name: TypeName, init?: {
  collate?:        string
  length?:         number
  maxValue?:       bigint | number | string | Date
  precision?:      number
  signed?:         boolean
  values?:         string[]
  variableLength?: boolean
  zeroFill?:       boolean
})
```

You can use the constructor directly, but the static helpers below are
usually more convenient.

#### Properties

- `name: TypeName` – main type family.
- `collate?: string` – character collation for text types.
- `length?: number` – length (for strings/binary/blob types) or integer size.
- `maxValue?: bigint | number | string | Date` – maximum value for integer
  types.
- `precision?: number` – number of decimals for `decimal` or `float`.
- `signed?: boolean` – whether numeric type is signed.
- `values?: string[]` – allowed values for `enum` or `set` types.
- `variableLength: boolean` – differentiates fixed vs. variable length
  binary/string types.
- `zeroFill: boolean` – whether numeric values are zero‑padded.

#### Static constructors

Each method returns a configured `Type` instance and accepts an optional
`options` object with the same fields as `init` above.

- `Type.bit(length: number, options?: Init)`
- `Type.binary(length: number, variableLength = false, options?: Init)` –
  binary/blob data.
- `Type.date(options?: Init)`
- `Type.dateTime(options?: Init)`
- `Type.decimal(length: number, precision: number, signed = true, options?: Init)`
- `Type.enum(values: string[], options?: Init)`
- `Type.float(precision: number, signed = true, options?: Init)`
- `Type.integer(maxValue?: bigint | number, signed = true, options?: Init)`
- `Type.set(values: string[], options?: Init)`
- `Type.string(length: number, variableLength = false, collate?: string, options?: Init)`
- `Type.time(options?: Init)`
- `Type.timestamp(options?: Init)`
- `Type.year(options?: Init)`

Example:

```ts
const idType   = Type.integer(undefined, true, { zeroFill: true })
const nameType = Type.string(255, true, 'utf8mb4_unicode_ci')
const roleType = Type.enum(['user', 'admin'])
```

---

### `class Column`

Represents a table column: its name, type, nullability and default value.

#### Constructor

```ts
new Column(name: string, type: Type, init?: {
  autoIncrement?: boolean
  canBeNull?:     boolean
  default?:       null | number | string | Date
  formerNames?:   string[]
})
```

#### Properties

- `name: string` – column name.
- `type: Type` – column type description.
- `autoIncrement: boolean` – whether the column auto‑increments.
- `canBeNull: boolean` – whether the column accepts `NULL` values.
- `default?: null | number | string | Date` – default value, normalized to
  the right JavaScript type based on `type.name`.
- `formerNames: string[]` – previous names this column had (useful when
  generating migrations).

#### Getters

- `charset: string | undefined` – for string types, derived from the
  associated `Type.collate` (e.g. `utf8mb4` from `utf8mb4_general_ci`).

---

### `type Constraint`

```ts
type Constraint = '' | 'cascade' | 'null' | 'restrict'
```

Represents the `ON DELETE` / `ON UPDATE` behaviour of a foreign key.

---

### `class ForeignKey`

Describes a foreign key constraint between two tables.

#### Constructor

```ts
new ForeignKey(
  name: string,
  fields: { main: string; foreign: string }[],
  foreignTableName: string,
  init?: {
    onDelete?: Constraint
    onUpdate?: Constraint
  }
)
```

#### Properties

- `name: string` – constraint name.
- `fields: { main: string; foreign: string }[]` – field pairs:
  - `main` – column name on the current table,
  - `foreign` – referenced column name on `foreignTableName`.
- `foreignTableName: string` – name of the referenced table.
- `onDelete: Constraint` – behaviour on delete.
- `onUpdate: Constraint` – behaviour on update.

---

### `type IndexType`

```ts
type IndexType = 'key' | 'primary' | 'unique'
```

Logical type of an index.

---

### `class Index`

Represents an index on a table.

#### Constructor

```ts
new Index(
  name: string,
  keys?: IndexKey | IndexKey[],
  init?: { type?: IndexType; unique?: boolean }
)
```

#### Properties

- `name: string` – index name (e.g. `PRIMARY`, `idx_user_email`).
- `keys: IndexKey[]` – indexed columns (and optional lengths).
- `type: IndexType` – logical type (`key`, `primary`, `unique`).
- `unique: boolean` – whether the index enforces uniqueness.

If `keys` is provided as a single `IndexKey` instance, it is wrapped into an
array automatically.

---

### `type KeyType`

```ts
type KeyType = 'key' | 'btree' | 'fulltext' | 'spatial' | 'unique'
```

Indicates the storage/engine kind of an index key. It is mainly useful when
working with database‑specific features such as full‑text or spatial indexes.

---

### `class IndexKey`

Represents a single column referenced by an index, optionally with a prefix
length.

#### Constructor

```ts
new IndexKey(columnName: string, length?: number)
```

#### Properties

- `columnName: string` – name of the column.
- `length?: number` – optional prefix length (for partial indexes on
  string/blob columns).

---

### `class Table`

Represents a database table, including columns, indexes and foreign keys.

#### Constructor

```ts
new Table(name: string, init?: {
  collation?:   string
  columns?:     Column[]
  engine?:      string
  foreignKeys?: ForeignKey[]
  indexes?:     Index[]
})
```

#### Properties

- `name: string` – table name.
- `collation: string` – table collation (e.g. `utf8mb4_general_ci`).
- `engine: string` – storage engine (often `InnoDB`).
- `columns: Column[]` – list of columns.
- `indexes: Index[]` – list of indexes.
- `foreignKeys: ForeignKey[]` – list of foreign key constraints.

#### Getters

- `charset: string` – derived from `collation` (part before the `_`).

## Typical use cases

- **Model database schemas in memory** using small, focused classes instead of
  raw SQL strings.
- **Share a common schema representation** between tools that inspect,
  generate or migrate relational databases.
- **Generate DDL** using packages such as `@itrocks/schema-to-mysql` from a
  schema built with `@itrocks/schema`.
- **Compare and migrate schemas** by feeding `Table` instances to
  `@itrocks/schema-diff` and its database‑specific companions.
- **Convert an existing database** into a reusable schema representation using
  `@itrocks/mysql-to-schema`.
- **Derive schemas from TypeScript models** with `@itrocks/reflect-to-schema`,
  then refine or inspect the result with the classes in this package.
