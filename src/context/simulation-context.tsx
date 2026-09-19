'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { buses as defaultBuses, urbanIssues as defaultIssues, notifications as defaultNotifications, routes } from '@/data/mock-data';
import { scenarioSteps, generateNotification, generateSimulatedDetection, interpolateBusPosition } from '@/lib/simulation';
import type { Bus, UrbanIssue, Notification, Detection } from '@/lib/types';
import { formatTime } from '@/lib/utils';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'critical';
  timestamp: string;
  actionUrl?: string;
}

interface SimulationContextType {
  isSimulating: boolean;
  isPresentationMode: boolean;
  scenarioActive: boolean;
  currentScenarioStep: number;
  buses: Bus[];
  issues: UrbanIssue[];
  notifications: Notification[];
  toasts: ToastItem[];
  // Mobile navigation
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (val: boolean) => void;
  toggleMobileMenu: () => void;
  // Actions
  toggleSimulation: (val?: boolean) => void;
  togglePresentation: (val?: boolean) => void;
  startScenario: () => void;
  nextScenarioStep: () => void;
  resetScenario: () => void;
  addToast: (toast: Omit<ToastItem, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;
  assignTeam: (issueId: string, teamName?: string) => void;
  markRepaired: (issueId: string) => void;
  verifyRepair: (issueId: string) => void;
  restartEdgeNode: (busId: string) => void;
  addNewDetection: (detection: Detection) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [scenarioActive, setScenarioActive] = useState(false);
  const [currentScenarioStep, setCurrentScenarioStep] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const [buses, setBuses] = useState<Bus[]>(defaultBuses);
  const [issues, setIssues] = useState<UrbanIssue[]>(defaultIssues);
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Add toast helper
  const addToast = useCallback((toast: Omit<ToastItem, 'id' | 'timestamp'>) => {
    const newToast: ToastItem = {
      ...toast,
      id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: formatTime(new Date()),
    };
    setToasts(prev => [newToast, ...prev.slice(0, 4)]); // keep max 5 toasts

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Toggle live simulation
  const toggleSimulation = useCallback((val?: boolean) => {
    setIsSimulating(prev => {
      const next = typeof val === 'boolean' ? val : !prev;
      if (next) {
        addToast({
          title: 'Live Fleet Simulation Activated',
          message: 'Public buses are moving along monitored transit corridors in Kolhapur.',
          type: 'info',
        });
      } else {
        addToast({
          title: 'Simulation Paused',
          message: 'Bus fleet tracking paused.',
          type: 'info',
        });
      }
      return next;
    });
  }, [addToast]);

  const togglePresentation = useCallback((val?: boolean) => {
    setIsPresentationMode(prev => {
      const next = typeof val === 'boolean' ? val : !prev;
      addToast({
        title: next ? 'Presentation Mode Enabled' : 'Presentation Mode Disabled',
        message: next ? 'Optimized for SIH judges with high-contrast HUD and demo controls.' : 'Returned to standard dashboard view.',
        type: 'info',
      });
      return next;
    });
  }, [addToast]);

  // Scenario Controls
  const startScenario = useCallback(() => {
    setScenarioActive(true);
    setCurrentScenarioStep(0);
    addToast({
      title: 'Running UrbanPulse Scenario (1/15)',
      message: `${scenarioSteps[0].icon} ${scenarioSteps[0].title}: ${scenarioSteps[0].description}`,
      type: 'info',
    });
  }, [addToast]);

  const nextScenarioStep = useCallback(() => {
    setCurrentScenarioStep(prev => {
      if (prev < scenarioSteps.length - 1) {
        const next = prev + 1;
        const step = scenarioSteps[next];
        addToast({
          title: `Step ${next + 1}/15: ${step.title}`,
          message: `${step.icon} ${step.description}`,
          type: next === 3 || next === 6 ? 'warning' : next === 14 ? 'success' : 'info',
        });
        return next;
      } else {
        setScenarioActive(false);
        addToast({
          title: 'Scenario Completed!',
          message: 'Full UrbanPulse end-to-end pipeline successfully demonstrated.',
          type: 'success',
        });
        return 0;
      }
    });
  }, [addToast]);

  const resetScenario = useCallback(() => {
    setScenarioActive(false);
    setCurrentScenarioStep(0);
    addToast({
      title: 'Scenario Reset',
      message: 'Demo state reset to initial values.',
      type: 'info',
    });
  }, [addToast]);

  // Action: Assign Team
  const assignTeam = useCallback((issueId: string, teamName: string = 'Team Alpha') => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        const updated: UrbanIssue = {
          ...issue,
          status: 'assigned',
          assignedTeam: teamName,
          timeline: [
            ...issue.timeline,
            {
              id: `TL-${Date.now()}`,
              timestamp: new Date().toISOString(),
              type: 'assigned',
              description: `Assigned to ${issue.assignedDepartment} — ${teamName}`,
            }
          ]
        };
        return updated;
      }
      return issue;
    }));

    addToast({
      title: `Team Assigned — ${issueId}`,
      message: `Dispatched ${teamName} to ${issueId}. Status updated to ASSIGNED.`,
      type: 'success',
    });
  }, [addToast]);

  // Action: Mark Repaired
  const markRepaired = useCallback((issueId: string) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        return {
          ...issue,
          status: 'repaired',
          timeline: [
            ...issue.timeline,
            {
              id: `TL-${Date.now()}`,
              timestamp: new Date().toISOString(),
              type: 'repaired',
              description: `Road maintenance patch completed by field team.`,
            }
          ]
        };
      }
      return issue;
    }));

    addToast({
      title: `Repair Logged — ${issueId}`,
      message: `Road maintenance completed. Awaiting next bus pass for AI verification.`,
      type: 'info',
      actionUrl: `/issues/${issueId}`,
    });
  }, [addToast]);

  // Action: Verify Repair
  const verifyRepair = useCallback((issueId: string) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        return {
          ...issue,
          status: 'verified',
          repairVerified: true,
          healthScoreAfter: 95,
          timeline: [
            ...issue.timeline,
            {
              id: `TL-${Date.now()}`,
              timestamp: new Date().toISOString(),
              type: 'reverified',
              description: `UrbanPulse AI re-scan verified repair. Road health: 42 → 95`,
              busId: 'BUS-042',
            }
          ]
        };
      }
      return issue;
    }));

    addToast({
      title: `Repair Verified — ${issueId}`,
      message: `AI re-scan confirmed pothole eliminated! Road Health Score: 42 → 95`,
      type: 'success',
      actionUrl: `/issues/${issueId}`,
    });
  }, [addToast]);

  // Action: Restart Edge Node
  const restartEdgeNode = useCallback((busId: string) => {
    setBuses(prev => prev.map(bus => {
      if (bus.id === busId) {
        return {
          ...bus,
          aiDeviceStatus: 'online',
          lastSync: 'Just now',
          gpuTemperature: 54,
          offlineQueue: 0,
        };
      }
      return bus;
    }));

    addToast({
      title: `Edge Node Rebooted — ${busId}`,
      message: `Jetson Orin Nano on ${busId} restarted. TensorRT RoadVision v3.2.1 reloaded.`,
      type: 'success',
      actionUrl: '/fleet',
    });
  }, [addToast]);

  // Action: Add New Detection
  const addNewDetection = useCallback((detection: Detection) => {
    // Check if issue exists
    setIssues(prev => {
      const existing = prev.find(i => i.id === detection.issueId);
      if (existing) {
        return prev.map(i => {
          if (i.id === detection.issueId) {
            return {
              ...i,
              sightings: i.sightings + 1,
              confidence: Math.min(0.99, i.confidence + 0.02),
              lastDetected: detection.timestamp,
              timeline: [
                ...i.timeline,
                {
                  id: `TL-${Date.now()}`,
                  timestamp: detection.timestamp,
                  type: 'repeated',
                  description: `Repeat sighting by ${detection.busId} on Route ${detection.routeId}`,
                  busId: detection.busId,
                }
              ]
            };
          }
          return i;
        });
      }
      return prev;
    });

    addToast({
      title: `Pothole Detected by ${detection.busId}`,
      message: `Confidence: ${(detection.confidence * 100).toFixed(0)}% • Route ${detection.routeId} • Merged with #${detection.issueId}`,
      type: 'warning',
      actionUrl: `/issues/${detection.issueId}`,
    });
  }, [addToast]);

  // Real-time bus movement simulation loop
  useEffect(() => {
    if (!isSimulating) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress = (progress + 0.02) % 1;

      setBuses(prevBuses =>
        prevBuses.map(bus => {
          const route = routes.find(r => r.id === bus.routeId);
          if (!route || route.waypoints.length < 2) return bus;

          const [newLat, newLng] = interpolateBusPosition(route.waypoints, progress);
          return {
            ...bus,
            currentLat: newLat,
            currentLng: newLng,
            speed: Math.floor(20 + Math.sin(progress * 10) * 12),
            lastSync: 'Just now',
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Periodic random detection during simulation
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      const activeBuses = buses.filter(b => b.isActive);
      if (activeBuses.length === 0) return;

      const randomBus = activeBuses[Math.floor(Math.random() * activeBuses.length)];
      const detection = generateSimulatedDetection(randomBus.id, randomBus.routeId);
      addNewDetection(detection);
    }, 15000);

    return () => clearInterval(interval);
  }, [isSimulating, buses, addNewDetection]);

  return (
    <SimulationContext.Provider
      value={{
        isSimulating,
        isPresentationMode,
        scenarioActive,
        currentScenarioStep,
        buses,
        issues,
        notifications,
        toasts,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        toggleMobileMenu,
        toggleSimulation,
        togglePresentation,
        startScenario,
        nextScenarioStep,
        resetScenario,
        addToast,
        removeToast,
        assignTeam,
        markRepaired,
        verifyRepair,
        restartEdgeNode,
        addNewDetection,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}
