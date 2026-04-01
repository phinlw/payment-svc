import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Metadata, status } from "@grpc/grpc-js";
import { RpcException } from "@nestjs/microservices";
import { ApiAccess } from "@/domain/models/base.model";
import { WALLET_BACKEND_KEY } from './env.util';

const serviceWhitelist = [WALLET_BACKEND_KEY];

@Injectable()
export class APIGrpcGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const metadata = context.getArgByIndex(1) as Metadata;
    const backendKey = metadata.get("backendKey")[0]?.toString();
    const platform = metadata.get("platform")[0]?.toString();
    const ownerId = metadata.get("ownerId")[0]?.toString();
    try {
      const contextData: ApiAccess = {
        platform: platform || "",
        backendKey: backendKey || "",
        ownerId: ownerId || "",
      };

      if (!serviceWhitelist.includes(contextData.backendKey)) {
        throw new RpcException({
          code: status.FAILED_PRECONDITION,
          message: "Invalid backend key",
        });
      }

      if (!contextData.platform) {
        throw new RpcException({
          code: status.FAILED_PRECONDITION,
          message: "Invalid platform",
        });
      }

      //   context.switchToRpc().getData().apiAccess = contextData;
      return true;
    } catch (error) {
      console.error("error====>", error);
      throw new RpcException({
        code: status.FAILED_PRECONDITION,
        message: error?.message || "Invalid backend key",
      });
    }
  }
}