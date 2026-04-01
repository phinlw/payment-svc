import { QueryProps } from "@/domain/models/query.model";
import {
  Repository,
  SelectQueryBuilder,
  Between,
  ObjectLiteral,
} from "typeorm";
import { joinConfig } from "./joinConfig";

export interface QueryResult<T> {
  data: T[];
  total: number;
}

// Build a TypeORM query based on provided parameters
export function buildQuery<T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  props?: QueryProps
): SelectQueryBuilder<T> {
  try {
    // Handle dynamic joins
    if (props?.joins?.length) {
      props.joins.forEach((joinName) => {
        const config = joinConfig.find((item) => {
          return item.field === joinName;
        });
        if (config) {
          // If condition is empty, use relation-based join (for ManyToOne/OneToMany)
          if (config.value.condition) {
            queryBuilder.leftJoinAndSelect(
              config.value.entity,
              config.value.alias,
              config.value.condition
            );
          } else {
            queryBuilder.leftJoinAndSelect(
              config.value.entity,
              config.value.alias
            );
          }
        } else {
          console.warn(`Unknown join name: ${joinName}`);
        }
      });
    }

    // Handle field selection
    if (props?.select?.length) {
      queryBuilder.select(props.select);
    }
    // Handle pagination
    if (props?.paginate?.limit && props?.paginate.page !== undefined) {
      const skip = props.paginate.page > 0 
        ? (props.paginate.page - 1) * props.paginate.limit 
        : 0;
      queryBuilder.take(props.paginate.limit).skip(skip);
    }

    // Handle date filtering
    if (props?.dateFilter?.startDate && props?.dateFilter?.endDate) {
      const startDate = new Date(props.dateFilter.startDate);
      const endDate = new Date(props.dateFilter.endDate);

      // Validate dates
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error("Invalid date format for startDate or endDate");
      }

      // Set time to cover full day
      startDate.setUTCHours(0, 0, 0, 0);
      endDate.setUTCHours(23, 59, 59, 999);

      queryBuilder.andWhere({
        createdAt: Between(startDate, endDate),
      });
    }

    // Handle sorting
    if (props?.sort) {
      queryBuilder.orderBy(
        "entity.createdAt",
        props.sort === 1 ? "ASC" : "DESC"
      );
    } else {
      queryBuilder.orderBy("entity.createdAt", "DESC");
    }

    // Handle search
    if (
      props?.search?.searchField &&
      props?.search?.searchField.length > 0 &&
      props?.search?.q
    ) {
      const searchConditions = props.search.searchField.map((field) => {
        return `entity.${field} ILIKE :searchTerm`;
      });

      queryBuilder.andWhere(`(${searchConditions.join(" OR ")})`, {
        searchTerm: `%${props.search.q}%`,
      });
    }

    // Handle conditions
    if (props?.condition && props?.condition.length > 0) {
      props.condition.forEach((condition) => {
        queryBuilder.andWhere(
          `entity.${condition.field} = :${condition.field}`,
          {
            [String(condition.field)]: condition.value,
          }
        );
      });
    }

    // Handle number arrays with IN operator
    if (props?.inNumber && props?.inNumber.length > 0) {
      props.inNumber.forEach((inNumber) => {
        queryBuilder.andWhere(
          `entity.${inNumber.field} IN (:...${inNumber.field})`,
          {
            [String(inNumber.field)]: inNumber.value,
          }
        );
      });
    }

    // Handle string arrays with IN operator
    if (props?.inString && props?.inString.length > 0) {
      props.inString.forEach((inString) => {
        queryBuilder.andWhere(
          `entity.${inString.field} IN (:...${inString.field})`,
          {
            [String(inString.field)]: inString.value,
          }
        );
      });
    }

    // Always filter for active records
    queryBuilder.andWhere("entity.isActive = :isActive", { isActive: true });

    return queryBuilder;
  } catch (error) {
    console.error("Error building query:", error);
    throw new Error(`Query building failed: ${error.message}`);
  }
}

// Execute a query against the repository with the given parameters
export async function executeQuery<T extends ObjectLiteral>(
  repository: Repository<T>,
  props?: QueryProps
): Promise<QueryResult<T>> {
  try {
    const alias = "entity";
    const queryBuilder = repository.createQueryBuilder(alias);

    const builtQuery = buildQuery(queryBuilder, props);

    const [data, total] = await builtQuery.getManyAndCount();

    return { data, total };
  } catch (error) {
    console.error("Error executing query:", error);
    return { data: [], total: 0 };
  }
}

// Helper function to convert request parameters to QueryProps format
export function createQueryProps(request: any): QueryProps {
  return {
    dateFilter: request?.query?.dateFilter,
    search: request?.query?.search,
    sort: request?.query?.sort,
    paginate: request?.query?.paginate,
    condition: request?.query?.condition,
    inNumber: request?.query?.inNumber,
    inString: request?.query?.inString,
    joins: request?.query?.joins,
    select: request?.query?.select,
  };
}