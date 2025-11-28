/**
 * API响应基础接口
 * @template T - 数据类型
 */
export interface ApiResponse<T = unknown> {
  /** 状态码 */
  code: number;
  /** 响应消息 */
  message: string;
  /** 响应数据（可选，为空时不返回） */
  data?: T;
  /** 时间戳 */
  time: string;
}

/**
 * 分页数据结构
 * @template T - 数据项类型
 */
export interface PaginatedData<T> {
  /** 数据列表 */
  items: T[];
  /** 总记录数 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  pageSize: number;
  /** 总页数 */
  totalPages: number;
}

/**
 * 分页响应接口
 * @template T - 数据项类型
 */
export type PaginatedResponse<T> = PaginatedData<T>;
