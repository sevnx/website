---
name: 'ParkTui'
startDate: '2025-09-01'
endDate: '2025-12-31'
status: 'Completed'
projectType: 'Academic'
shortDescription: 'A parking lot management simulator, in the terminal.'
stack: ['C']
applicationType: ['TUI']
githubUrl: 'https://github.com/sevnx/parktui'
---

## Presentation

ParkTui is a terminal-based parking lot management simulator written in C. Players manage a parking lot by handling vehicle flow, collecting revenue, purchasing upgrades, and responding to random events, all while balancing resources like money, satisfaction, and prestige. The game features multiple difficulty levels, custom map support, and a manual mode where the player directly drives vehicles with arrow keys.

## Key responsibilities

### Game Architecture

- Designed the **finite state machine** driving the entire application (Configuring, Playing, Paused, Finished) with callbacks and a **tagged-union action system** for state transitions and event dispatching
- Implemented the **frame-rate controlled game loop** handling input dispatch, frame ticking, vehicle spawning, event checking, and win/loss condition evaluation
- Built the **session state system** managing game modifiers (balance, satisfaction, prestige, spawn rates, hourly rates) with per-tick and daily update logic

### Vehicle System

- Implemented the full **vehicle lifecycle** with a 6-state machine (Entering, Searching, Parked, Leaving, Exiting, Exited), including movement, turning, collision detection against map cells and other vehicles, and parking slot detection
- Built the **vehicle manager** with an intrusive linked list and **free list** for struct recycling, handling AI pathfinding, manual player control, and a blocked-patience system with automatic reverse after 30 stalled frames

### Memory Management

- Designed an **arena-based memory allocator** with arenas scoped to different lifetimes (game, session, UI, per-frame, FSM state), supporting snapshot/restore for deallocation on overlay and state transitions

### TUI Rendering

- Built the **UI handler** with a **view stack** architecture (base view + overlays), where each view exposes a callback interface for window init, drawing, refresh, and input handling, with arena snapshots tied to overlay push/pop for automatic cleanup
- Implemented efficient rendering using a **dirty cell tracker** to minimize redraws
