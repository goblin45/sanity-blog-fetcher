import { NextResponse } from 'next/server';

import { logger } from '@/lib/logging/logger';

type RouteContext = {
  params?: Promise<Record<string, string | string[]>>;
};

type RouteHandler = (
  request: Request,
  context: RouteContext,
) => Promise<Response> | Response;

/**
 * Centralized try/catch wrapper for App Router route handlers.
 * All exported route methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) must use this helper.
 * Logs unexpected errors without leaking internals to clients.
 *
 * @param handler - Route handler implementation.
 * @returns Wrapped handler that returns a safe 500 JSON body on unhandled failures.
 */
export function withRouteHandler(handler: RouteHandler): RouteHandler {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const name = error instanceof Error ? error.name : 'Error';

      logger.error('Unhandled route error', {
        method: request.method,
        url: request.url,
        errorName: name,
        errorMessage: message,
      });

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }
  };
}
