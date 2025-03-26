"use client";

import { apiClient } from "@/features/core/tanstack-query-api";
import { AUTH_ENDPOINTS } from "../constants/endpoints";
import { tokenManager } from "../../core/tokenManager";

/**
 * Service for managing user sessions
 */
export const sessionService = {
  /**
   * Logout the current user
   * @param sessionId Optional specific session ID to invalidate
   * @returns Promise<void>
   */
  logout: async (sessionId?: string): Promise<void> => {
    const token = tokenManager.getToken();
    if (!token) {
      console.warn("Attempting to logout without a token");
      tokenManager.clearAll();
      return;
    }

    try {
      // Parameters for the logout request
      const params: Record<string, string> = {};
      if (sessionId) {
        params.sessionId = sessionId;
      }

      // Call the logout endpoint
      await apiClient.post(
        AUTH_ENDPOINTS.LOGOUT,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params,
        }
      );
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Always clear local tokens regardless of server response
      tokenManager.clearAll();
    }
  },

  /**
   * Force logout from all other devices but keep current session active
   * @param currentSessionId Current session ID to keep active
   * @returns Promise<boolean> - true if successful, false otherwise
   */
  forceLogout: async (currentSessionId: string): Promise<boolean> => {
    const token = tokenManager.getToken();
    if (!token || !currentSessionId) {
      console.error("Missing token or session ID for force logout");
      return false;
    }

    try {
      await apiClient.post(
        AUTH_ENDPOINTS.FORCE_LOGOUT,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            currentSessionId,
          },
        }
      );
      return true;
    } catch (error) {
      console.error("Error during force logout:", error);
      return false;
    }
  },

  /**
   * Get all active sessions for the current user
   * @returns Promise with list of active sessions
   */
  getSessions: async () => {
    const token = tokenManager.getToken();
    if (!token) {
      console.warn("Attempting to get sessions without a token");
      return [];
    }

    try {
      const response = await apiClient.get(AUTH_ENDPOINTS.SESSION_MONITORING, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data || [];
    } catch (error) {
      console.error("Error getting sessions:", error);
      return [];
    }
  },

  /**
   * Terminate a specific session
   * @param sessionId ID of the session to terminate
   * @returns Promise<boolean> - true if successful, false otherwise
   */
  terminateSession: async (sessionId: string): Promise<boolean> => {
    const token = tokenManager.getToken();
    if (!token) {
      console.warn("Attempting to terminate session without a token");
      return false;
    }

    try {
      const endpoint = AUTH_ENDPOINTS.TERMINATE_SESSION.replace(
        ":id",
        sessionId
      );
      await apiClient.delete(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return true;
    } catch (error) {
      console.error("Error terminating session:", error);
      return false;
    }
  },
};

export default sessionService;