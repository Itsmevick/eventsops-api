import type { Request, Response } from "express";
export declare function create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function list(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function stats(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function update(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function publish(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function archive(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function metrics(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=events.controller.d.ts.map