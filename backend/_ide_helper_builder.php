<?php
// @formatter:off
// phpcs:ignoreFile
/**
 * Stubs for Illuminate\Database\Eloquent\Builder instance methods.
 * NOT loaded at runtime — for IDE (Intelephense) support only.
 */

namespace Illuminate\Database\Eloquent;

class Builder
{
    /** @return static */
    public function where($column, $operator = null, $value = null, $boolean = 'and') { return $this; }

    /** @return static */
    public function orWhere($column, $operator = null, $value = null) { return $this; }

    /** @return static */
    public function whereIn($column, $values, $boolean = 'and', $not = false) { return $this; }

    /** @return static */
    public function whereNotIn($column, $values, $boolean = 'and') { return $this; }

    /** @return static */
    public function whereNull($columns, $boolean = 'and', $not = false) { return $this; }

    /** @return static */
    public function whereNotNull($columns, $boolean = 'and') { return $this; }

    /** @return static */
    public function whereHas($relation, $callback = null, $operator = '>=', $count = 1) { return $this; }

    /** @return static */
    public function whereYear($column, $operator, $value = null, $boolean = 'and') { return $this; }

    /** @return static */
    public function whereMonth($column, $operator, $value = null, $boolean = 'and') { return $this; }

    /** @return static */
    public function whereDay($column, $operator, $value = null, $boolean = 'and') { return $this; }

    /** @return static */
    public function whereDate($column, $operator, $value = null, $boolean = 'and') { return $this; }

    /** @return static */
    public function whereBetween($column, $values, $boolean = 'and', $not = false) { return $this; }

    /** @return static */
    public function orderBy($column, $direction = 'asc') { return $this; }

    /** @return static */
    public function orderByDesc($column) { return $this; }

    /** @return static */
    public function latest($column = 'created_at') { return $this; }

    /** @return static */
    public function oldest($column = 'created_at') { return $this; }

    /** @return static */
    public function limit($value) { return $this; }

    /** @return static */
    public function take($value) { return $this; }

    /** @return static */
    public function skip($value) { return $this; }

    /** @return static */
    public function offset($value) { return $this; }

    /** @return static */
    public function select($columns = ['*']) { return $this; }

    /** @return static */
    public function with($relations, $callback = null) { return $this; }

    /** @return static */
    public function withCount($relations) { return $this; }

    /** @return static */
    public function withAvg($relation, $column) { return $this; }

    /** @return static */
    public function withSum($relation, $column) { return $this; }

    /** @return static */
    public function withMax($relation, $column) { return $this; }

    /** @return static */
    public function withMin($relation, $column) { return $this; }

    /** @return static */
    public function has($relation, $operator = '>=', $count = 1, $boolean = 'and', $callback = null) { return $this; }

    /** @return static */
    public function doesntHave($relation, $boolean = 'and', $callback = null) { return $this; }

    /** @return static */
    public function when($condition, $callback, $default = null) { return $this; }

    /** @return \Illuminate\Database\Eloquent\Model|static|null */
    public function find($id, $columns = ['*']) { return null; }

    /** @return \Illuminate\Database\Eloquent\Model|static */
    public function findOrFail($id, $columns = ['*']) { return $this; }

    /** @return \Illuminate\Database\Eloquent\Model|static|null */
    public function first($columns = ['*']) { return null; }

    /** @return \Illuminate\Database\Eloquent\Model|static */
    public function firstOrFail($columns = ['*']) { return $this; }

    /** @return \Illuminate\Database\Eloquent\Collection */
    public function get($columns = ['*']) { return new \Illuminate\Database\Eloquent\Collection(); }

    /** @return \Illuminate\Contracts\Pagination\LengthAwarePaginator */
    public function paginate($perPage = 15, $columns = ['*'], $pageName = 'page', $page = null) { return $this; }

    /** @return int */
    public function count($columns = '*') { return 0; }

    /** @return mixed */
    public function sum($column) { return 0; }

    /** @return mixed */
    public function max($column) { return null; }

    /** @return mixed */
    public function min($column) { return null; }

    /** @return mixed */
    public function avg($column) { return null; }

    /** @return bool */
    public function exists() { return false; }

    /** @return bool */
    public function doesntExist() { return true; }
}

namespace Illuminate\Database\Query;

class Builder
{
    /** @return static */
    public function where($column, $operator = null, $value = null, $boolean = 'and') { return $this; }

    /** @return static */
    public function orWhere($column, $operator = null, $value = null) { return $this; }

    /** @return static */
    public function whereIn($column, $values, $boolean = 'and', $not = false) { return $this; }

    /** @return static */
    public function whereNotIn($column, $values, $boolean = 'and') { return $this; }

    /** @return static */
    public function whereNull($columns, $boolean = 'and', $not = false) { return $this; }

    /** @return static */
    public function whereRaw($sql, $bindings = [], $boolean = 'and') { return $this; }

    /** @return static */
    public function orderBy($column, $direction = 'asc') { return $this; }

    /** @return static */
    public function orderByDesc($column) { return $this; }

    /** @return static */
    public function latest($column = 'created_at') { return $this; }

    /** @return static */
    public function limit($value) { return $this; }

    /** @return static */
    public function select($columns = ['*']) { return $this; }

    /** @return static */
    public function join($table, $first, $operator = null, $second = null, $type = 'inner', $where = false) { return $this; }

    /** @return \Illuminate\Support\Collection */
    public function get($columns = ['*']) { return new \Illuminate\Support\Collection(); }

    /** @return \Illuminate\Support\Collection */
    public function pluck($column, $key = null) { return new \Illuminate\Support\Collection(); }

    /** @return int */
    public function count($columns = '*') { return 0; }

    /** @return mixed */
    public function sum($column) { return 0; }

    /** @return mixed */
    public function max($column) { return null; }

    /** @return mixed */
    public function min($column) { return null; }

    /** @return mixed */
    public function avg($column) { return null; }

    /** @return object|null */
    public function first($columns = ['*']) { return null; }

    /** @return bool */
    public function exists() { return false; }

    /** @return int */
    public function insert(array $values) { return 0; }

    /** @return int */
    public function update(array $values) { return 0; }

    /** @return int */
    public function delete($id = null) { return 0; }
}
