import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { MessageSquare, Cpu, Database, Zap, Terminal, Activity, Eye, EyeOff } from 'lucide-react';
import './Workflow3D.css';

export default function Workflow3D() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Tooltip & status DOM references
  const tooltipRefs = useRef([]);
  const statusRef = useRef(null);

  // React state for HUD dashboard
  const [activeNode, setActiveNode] = useState(null);
  const [cognitiveState, setCognitiveState] = useState('RESTING POTENTIAL');
  const [scanMode, setScanMode] = useState(false);

  // Shared bridge ref between React button callbacks and Three.js loop
  const controlsRef = useRef({
    triggerNeuralStorm: null,
    triggerPulse: null,
    scanMode: false,
    zoomIn: null,
    zoomOut: null
  });

  const nodeData = [
    {
      id: 1,
      title: 'Lead Captured',
      tag: 'LIVE FEED',
      desc: 'Form submission received',
      icon: <MessageSquare size={14} />,
      color: '#06b6d4', // Cyan
      pos: { x: -1.2, y: 0.6, z: -1.4 }
    },
    {
      id: 2,
      title: 'AI Classifier',
      tag: 'AI PROCESSING',
      desc: "Confidence: 99.1% - Tagged: 'Growth Lead'",
      icon: <Cpu size={14} />,
      color: '#7c3aed', // Purple
      pos: { x: 0.0, y: 0.3, z: -0.2 }
    },
    {
      id: 3,
      title: 'SQLite Database',
      tag: 'DATABASE ENTRY',
      desc: 'Row inserted in submissions.db',
      icon: <Database size={14} />,
      color: '#10b981', // Teal
      pos: { x: 1.0, y: -0.2, z: 0.6 }
    },
    {
      id: 4,
      title: 'Auto-Response',
      tag: 'AUTO-EXECUTION',
      desc: 'Slack alert dispatched in 40ms',
      icon: <Zap size={14} />,
      color: '#f59e0b', // Amber
      pos: { x: 1.2, y: 0.8, z: -0.5 }
    }
  ];

  // React Button Trigger Handlers
  const handleNeuralStorm = () => {
    if (controlsRef.current.triggerNeuralStorm) {
      setCognitiveState('NEURAL STORM CASCADE');
      controlsRef.current.triggerNeuralStorm();
      // Reset state back to normal after storm completes (2.5s)
      setTimeout(() => {
        setCognitiveState('RESTING POTENTIAL');
      }, 2500);
    }
  };

  const handleInjectStimulus = () => {
    if (controlsRef.current.triggerPulse) {
      setCognitiveState('STIMULUS RECEIVED');
      controlsRef.current.triggerPulse();
      setTimeout(() => {
        setCognitiveState('RESTING POTENTIAL');
      }, 1200);
    }
  };

  const handleToggleScan = () => {
    const nextScan = !scanMode;
    setScanMode(nextScan);
    controlsRef.current.scanMode = nextScan;
  };

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    let width = container.clientWidth;
    let height = container.clientHeight || 520;

    // --- 1. Scene Setup ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040508, 0.06);

    // --- 2. Camera Setup (Orthographic for Isometric projection) ---
    const aspect = width / height;
    const d = 2.4; // Zoom scale factor
    const camera = new THREE.OrthographicCamera(
      -d * aspect,
      d * aspect,
      d,
      -d,
      1,
      1000
    );
    camera.position.set(10, 8.5, 10);
    camera.lookAt(0, 0, 0);

    // Track target zoom for smooth scroll transitions
    let targetZoom = 1.0;
    camera.zoom = 1.0;

    // --- 3. Renderer Setup ---
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- 4. Lights ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    // --- 5. Brain Group Setup (contains all nodes, synapses, and pulses) ---
    const brainGroup = new THREE.Group();
    scene.add(brainGroup);

    // --- 6. Brain Nodes Generation (70 nodes) ---
    const nodes = [];
    
    // Explicitly define primary/workflow nodes
    nodes.push({ x: -1.2, y: 0.6, z: -1.4, isPrimary: true, id: 1, color: '#06b6d4' }); // Lead Captured (0)
    nodes.push({ x: 0.0, y: 0.3, z: -0.2, isPrimary: true, id: 2, color: '#7c3aed' });  // AI Classifier (1)
    nodes.push({ x: 1.0, y: -0.2, z: 0.6, isPrimary: true, id: 3, color: '#10b981' });  // SQLite Database (2)
    nodes.push({ x: 1.2, y: 0.8, z: -0.5, isPrimary: true, id: 4, color: '#f59e0b' });  // Auto-Response (3)

    // Intermediate path nodes to route pulses organically through the brain lobes
    nodes.push({ x: -0.8, y: 0.5, z: -1.0, isPath: true }); // Index 4 (Lead -> AI step 1)
    nodes.push({ x: -0.4, y: 0.4, z: -0.6, isPath: true }); // Index 5 (Lead -> AI step 2)
    nodes.push({ x: 0.4, y: 0.1, z: 0.1, isPath: true });   // Index 6 (AI -> DB step 1)
    nodes.push({ x: 0.8, y: -0.1, z: 0.4, isPath: true });  // Index 7 (AI -> DB step 2)
    nodes.push({ x: 0.4, y: 0.5, z: -0.3, isPath: true });  // Index 8 (AI -> Auto step 1)
    nodes.push({ x: 0.8, y: 0.7, z: -0.4, isPath: true });  // Index 9 (AI -> Auto step 2)

    // Generate Left/Right cerebral cortex, cerebellum, and brainstem coordinates
    for (let i = 10; i < 70; i++) {
      if (i >= 10 && i < 35) {
        // Left Cerebral Hemisphere (x < 0)
        const theta = Math.random() * Math.PI;
        const phi = (Math.random() - 0.5) * Math.PI;
        const rx = 1.25 + Math.sin(phi * 4.0) * 0.12;
        const ry = 0.85 + Math.cos(theta * 3.0) * 0.08;
        const rz = 1.5;
        nodes.push({
          x: -Math.abs(rx * Math.sin(theta) * Math.cos(phi)) - 0.1,
          y: ry * Math.sin(theta) * Math.sin(phi) + 0.2,
          z: rz * Math.cos(theta) - 0.1,
          isAuxiliary: true
        });
      } else if (i >= 35 && i < 60) {
        // Right Cerebral Hemisphere (x > 0)
        const theta = Math.random() * Math.PI;
        const phi = (Math.random() - 0.5) * Math.PI;
        const rx = 1.25 + Math.sin(phi * 4.0) * 0.12;
        const ry = 0.85 + Math.cos(theta * 3.0) * 0.08;
        const rz = 1.5;
        nodes.push({
          x: Math.abs(rx * Math.sin(theta) * Math.cos(phi)) + 0.1,
          y: ry * Math.sin(theta) * Math.sin(phi) + 0.2,
          z: rz * Math.cos(theta) - 0.1,
          isAuxiliary: true
        });
      } else if (i >= 60 && i < 66) {
        // Cerebellum (dense lower-back structure)
        const theta = Math.random() * Math.PI;
        const phi = Math.random() * Math.PI * 2;
        const r = 0.45 + Math.random() * 0.25;
        nodes.push({
          x: r * Math.sin(theta) * Math.cos(phi) * 1.1,
          y: r * Math.sin(theta) * Math.sin(phi) * 0.5 - 0.6,
          z: r * Math.cos(theta) * 0.7 + 0.8,
          isAuxiliary: true
        });
      } else {
        // Brainstem (vertical descending base)
        const idx = i - 66;
        nodes.push({
          x: (Math.random() - 0.5) * 0.1,
          y: -0.6 - idx * 0.18,
          z: 0.25 + (Math.random() - 0.5) * 0.1,
          isAuxiliary: true
        });
      }
    }

    // --- 7. Synapses Connections (Nerve segments) ---
    const nodeConnections = [];
    const adjacencyList = Array.from({ length: 70 }, () => []);

    const addConnection = (a, b) => {
      const exists = nodeConnections.some(c => (c.from === a && c.to === b) || (c.from === b && c.to === a));
      if (!exists && a !== b) {
        nodeConnections.push({ from: a, to: b });
        adjacencyList[a].push(b);
        adjacencyList[b].push(a);
      }
    };

    // Link explicit workflow paths
    addConnection(0, 4); addConnection(4, 5); addConnection(5, 1); // Path 1
    addConnection(1, 6); addConnection(6, 7); addConnection(7, 2); // Path 2
    addConnection(1, 8); addConnection(8, 9); addConnection(9, 3); // Path 3

    // Wire nearby nodes based on distance threshold
    for (let i = 0; i < 70; i++) {
      const distances = [];
      for (let j = 0; j < 70; j++) {
        if (i === j) continue;
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dz = nodes[i].z - nodes[j].z;
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        distances.push({ index: j, dist });
      }

      distances.sort((x, y) => x.dist - y.dist);

      let connectedCount = adjacencyList[i].length;
      for (let k = 0; k < distances.length && connectedCount < 3; k++) {
        const neighbor = distances[k];
        if (neighbor.dist < 1.3) {
          addConnection(i, neighbor.index);
          connectedCount++;
        }
      }
    }

    // --- 8. Render Neural Network Components ---

    // 8a. Node Group Meshes
    const nodeObjects = nodes.map((node, index) => {
      const group = new THREE.Group();
      group.position.set(node.x, node.y, node.z);

      let size = 0.04;
      let color = 0x1e293b;

      if (node.isPrimary) {
        size = 0.11;
        color = node.color;

        // Outer glow capsule
        const outerGeo = new THREE.SphereGeometry(size * 1.6, 16, 16);
        const outerMat = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.18
        });
        const outerMesh = new THREE.Mesh(outerGeo, outerMat);
        group.add(outerMesh);

        // Core sphere
        const coreGeo = new THREE.SphereGeometry(size, 16, 16);
        const coreMat = new THREE.MeshBasicMaterial({ color: color });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        group.add(coreMesh);

        // Local dynamic point light
        const pl = new THREE.PointLight(color, 2.0, 3.5);
        group.add(pl);

        group.userData = { isPrimary: true, id: node.id, color, pointLight: pl, coreMesh };
      } else if (node.isPath) {
        size = 0.055;
        const coreGeo = new THREE.SphereGeometry(size, 8, 8);
        const coreMat = new THREE.MeshBasicMaterial({
          color: 0x4f46e5,
          transparent: true,
          opacity: 0.65
        });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        group.add(coreMesh);
        group.userData = { isPrimary: false };
      } else {
        // General auxiliary nerve cell
        size = 0.032;
        const coreGeo = new THREE.SphereGeometry(size, 8, 8);
        const coreMat = new THREE.MeshBasicMaterial({
          color: 0x475569,
          transparent: true,
          opacity: 0.35
        });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        group.add(coreMesh);
        group.userData = { isPrimary: false };
      }

      brainGroup.add(group);
      return group;
    });

    // 8b. Faint Background Synaptic Lines
    const linePositions = [];
    const lineColors = [];
    const c1 = new THREE.Color(0x312e81);
    const c2 = new THREE.Color(0x1e1b4b);

    nodeConnections.forEach(conn => {
      const fromNode = nodes[conn.from];
      const toNode = nodes[conn.to];
      linePositions.push(fromNode.x, fromNode.y, fromNode.z);
      linePositions.push(toNode.x, toNode.y, toNode.z);
      lineColors.push(c1.r, c1.g, c1.b);
      lineColors.push(c2.r, c2.g, c2.b);
    });

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    lineGeo.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.14,
      depthWrite: false
    });
    const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
    brainGroup.add(lineSegments);

    // 8c. Primary Route High-Glow Synaptic Lines
    const pathLinePositions = [];
    pathConnectionsList.forEach(([a, b]) => {
      const fromNode = nodes[a];
      const toNode = nodes[b];
      pathLinePositions.push(fromNode.x, fromNode.y, fromNode.z);
      pathLinePositions.push(toNode.x, toNode.y, toNode.z);
    });

    const pathLineGeo = new THREE.BufferGeometry();
    pathLineGeo.setAttribute('position', new THREE.Float32BufferAttribute(pathLinePositions, 3));

    const pathLineMat = new THREE.LineBasicMaterial({
      color: 0x4f46e5,
      transparent: true,
      opacity: 0.42
    });
    const pathLineSegments = new THREE.LineSegments(pathLineGeo, pathLineMat);
    brainGroup.add(pathLineSegments);

    // --- 9. Ambient Volumetric Floating Particles (Cognitive cloud) ---
    const particleCount = 120;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = [];

    for (let i = 0; i < particleCount; i++) {
      // Random shell distribution around brain coordinates
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.4 + Math.random() * 1.8;

      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.8;
      particlePositions[i * 3 + 2] = r * Math.cos(phi);

      particleSpeeds.push({
        orbit: 0.002 + Math.random() * 0.004,
        pulseSpeed: 1.5 + Math.random() * 2,
        phase: Math.random() * Math.PI
      });
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x818cf8,
      size: 0.038,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particlePoints = new THREE.Points(particleGeo, particleMat);
    brainGroup.add(particlePoints);

    // --- 10. Synaptic Impulse Firing Engine (Sparks) ---
    const activeSignals = [];
    const activeWaves = [];

    const spawnSignal = (nodePath, colorHex, isRealSubmit = false, onComplete = null) => {
      const size = isRealSubmit ? 0.08 : 0.048;
      const geo = new THREE.SphereGeometry(size, 8, 8);
      const mat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.95
      });
      const mesh = new THREE.Mesh(geo, mat);

      const startNode = nodes[nodePath[0]];
      mesh.position.set(startNode.x, startNode.y, startNode.z);
      brainGroup.add(mesh);

      activeSignals.push({
        mesh,
        geo,
        mat,
        path: nodePath,
        currentHop: 0,
        progress: 0.0,
        speed: isRealSubmit ? 0.05 : 0.022,
        color: colorHex,
        isRealSubmit,
        onComplete
      });
    };

    const triggerWave = (nodeIndex, colorHex) => {
      const node = nodes[nodeIndex];
      const ringGeo = new THREE.RingGeometry(0.04, 0.25, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(node.x, node.y, node.z);
      ringMesh.rotation.x = Math.PI / 2;
      brainGroup.add(ringMesh);

      activeWaves.push({
        mesh: ringMesh,
        geo: ringGeo,
        mat: ringMat,
        scale: 1.0,
        opacity: 0.8,
        speed: 0.075
      });
    };

    const triggerNeuralStorm = () => {
      // Flash the connections bright
      lineMat.opacity = 0.5;
      pathLineMat.opacity = 0.85;

      // Spawn 35 random pulses in rapid sequence
      for (let i = 0; i < 35; i++) {
        setTimeout(() => {
          const startIdx = Math.floor(Math.random() * 70);
          const neighbors = adjacencyList[startIdx];
          if (neighbors && neighbors.length > 0) {
            const hop1 = neighbors[Math.floor(Math.random() * neighbors.length)];
            const hop1Neighbors = adjacencyList[hop1];
            const hop2 = hop1Neighbors && hop1Neighbors.length > 0
              ? hop1Neighbors[Math.floor(Math.random() * hop1Neighbors.length)]
              : null;
            
            const path = [startIdx, hop1];
            if (hop2 && hop2 !== startIdx && hop2 !== hop1) {
              path.push(hop2);
            }

            const colors = ['#06b6d4', '#7c3aed', '#10b981', '#f59e0b', '#ec4899', '#6366f1'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            spawnSignal(path, randomColor, true);

            // Pop scaling on local nodes
            const group = nodeObjects[startIdx];
            if (group && !nodes[startIdx].isPrimary) {
              group.scale.set(1.5, 1.5, 1.5);
            }
          }
        }, i * 35);
      }
    };

    const triggerPulse = () => {
      // Find a random start node and neighbors
      const startIdx = Math.floor(Math.random() * 70);
      const neighbors = adjacencyList[startIdx];
      if (neighbors && neighbors.length > 0) {
        const hop1 = neighbors[Math.floor(Math.random() * neighbors.length)];
        const path = [startIdx, hop1];
        
        const colors = ['#06b6d4', '#7c3aed', '#10b981', '#f59e0b'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        spawnSignal(path, randomColor, true); // Inject fast high-intensity spark
        
        // Flash target node wave
        triggerWave(hop1, randomColor);
      }
    };

    // Bind local triggers to controlsRef bridge
    controlsRef.current.triggerNeuralStorm = triggerNeuralStorm;
    controlsRef.current.triggerPulse = triggerPulse;

    // Handle Form Submit Event Sequence
    const handleFormSubmit = () => {
      setCognitiveState('LEAD RECEIVED');
      
      triggerWave(0, '#06b6d4');
      const node0 = nodeObjects[0];
      if (node0) node0.scale.set(2.2, 2.2, 2.2);

      // Spawn 3 Cyan sparks spaced 110ms apart
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          spawnSignal([0, 4, 5, 1], '#06b6d4', true, i === 0 ? () => {
            // Fired Classifier stage
            setCognitiveState('CLASSIFICATION CASCADE');
            triggerWave(1, '#7c3aed');
            const node1 = nodeObjects[1];
            if (node1) node1.scale.set(2.2, 2.2, 2.2);

            setTimeout(() => {
              // Path to Database: [1, 6, 7, 2]
              for (let j = 0; j < 3; j++) {
                setTimeout(() => {
                  spawnSignal([1, 6, 7, 2], '#10b981', true, j === 0 ? () => {
                    setCognitiveState('STATED STORAGE WRITE');
                    triggerWave(2, '#10b981');
                    const node2 = nodeObjects[2];
                    if (node2) node2.scale.set(2.2, 2.2, 2.2);
                  } : null);
                }, j * 110);
              }

              // Path to Auto-Response: [1, 8, 9, 3]
              for (let j = 0; j < 3; j++) {
                setTimeout(() => {
                  spawnSignal([1, 8, 9, 3], '#f59e0b', true, j === 0 ? () => {
                    setCognitiveState('DISPATCHING AUTO-REACTION');
                    triggerWave(3, '#f59e0b');
                    const node3 = nodeObjects[3];
                    if (node3) node3.scale.set(2.2, 2.2, 2.2);

                    // Synaptic burst Storm finishes the processing flow
                    triggerNeuralStorm();
                    setTimeout(() => {
                      setCognitiveState('RESTING POTENTIAL');
                    }, 2500);
                  } : null);
                }, j * 110);
              }
            }, 180);
          } : null);
        }, i * 110);
      }
    };

    window.addEventListener('lead-submitted', handleFormSubmit);

    // Idle background impulse ticker
    const spawnIdleSignal = () => {
      const startIdx = Math.floor(Math.random() * 70);
      const neighbors = adjacencyList[startIdx];
      if (neighbors && neighbors.length > 0) {
        const hop1 = neighbors[Math.floor(Math.random() * neighbors.length)];
        const hop1Neighbors = adjacencyList[hop1];
        const hop2 = hop1Neighbors && hop1Neighbors.length > 0
          ? hop1Neighbors[Math.floor(Math.random() * hop1Neighbors.length)]
          : null;

        const path = [startIdx, hop1];
        if (hop2 && hop2 !== startIdx && hop2 !== hop1) {
          path.push(hop2);
        }

        const colors = ['#818cf8', '#6366f1', '#4f46e5', '#3b82f6'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        spawnSignal(path, randomColor, false);
      }
    };

    const idleTimer = setInterval(spawnIdleSignal, 500);

    // --- 11. Custom Mouse Interaction (Drag-to-rotate & Raycaster Hover & Scroll-to-Zoom) ---
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0;
    let targetRotationY = 0;
    let rotationX = 0;
    let rotationY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (event) => {
      // Raycasting hover check (only check when not actively dragging to save GPU resources)
      if (!isDragging) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        let foundIntersect = null;
        for (let i = 0; i < intersects.length; i++) {
          let parent = intersects[i].object.parent;
          while (parent && parent !== scene) {
            if (nodeObjects.includes(parent)) {
              foundIntersect = parent;
              break;
            }
            parent = parent.parent;
          }
          if (foundIntersect) break;
        }

        if (foundIntersect && foundIntersect.userData.isPrimary) {
          setActiveNode(foundIntersect.userData.id);
        } else {
          setActiveNode(null);
        }
      } else {
        // Drag rotation logic
        const deltaMove = {
          x: event.clientX - previousMousePosition.x,
          y: event.clientY - previousMousePosition.y
        };

        targetRotationY += deltaMove.x * 0.005;
        targetRotationX += deltaMove.y * 0.005;

        previousMousePosition = { x: event.clientX, y: event.clientY };
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Mobile touch drag rotation
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e) => {
      if (isDragging && e.touches.length === 1) {
        const deltaMove = {
          x: e.touches[0].clientX - previousMousePosition.x,
          y: e.touches[0].clientY - previousMousePosition.y
        };
        targetRotationY += deltaMove.x * 0.006;
        targetRotationX += deltaMove.y * 0.006;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    // Scroll to zoom
    const onWheel = (e) => {
      e.preventDefault();
      // Adjust target zoom bounds between 0.6x and 3.0x
      targetZoom = Math.max(0.6, Math.min(3.0, targetZoom - e.deltaY * 0.0012));
    };

    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('touchend', onTouchEnd);
    container.addEventListener('wheel', onWheel, { passive: false });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // --- 12. Animation Loop & HTML projection ---
    const tempV = new THREE.Vector3();
    const clock = new THREE.Clock();
    let lastScanMode = false;

    const animate = () => {
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth camera zoom interpolation
      camera.zoom += (targetZoom - camera.zoom) * 0.1;
      camera.updateProjectionMatrix();

      // Smooth inertia rotation interpolation for dragging
      rotationX += (targetRotationX - rotationX) * 0.08;
      rotationY += (targetRotationY - rotationY) * 0.08;

      // Apply drag rotations on top of base auto-orbit spin
      brainGroup.rotation.y = rotationY + elapsedTime * 0.045;
      brainGroup.rotation.x = rotationX;
      brainGroup.rotation.z = Math.sin(elapsedTime * 0.3) * 0.03;

      // Parallax particle cloud rotation in opposite direction
      particlePoints.rotation.y = -elapsedTime * 0.02;
      particlePoints.rotation.x = Math.sin(elapsedTime * 0.15) * 0.03;

      // Pulse floating particle opacities
      particleMat.opacity = 0.4 + Math.sin(elapsedTime * 1.8) * 0.15;

      // React to Holographic scan toggle colors
      const currentScanMode = controlsRef.current.scanMode;
      if (currentScanMode !== lastScanMode) {
        lastScanMode = currentScanMode;
        if (currentScanMode) {
          // Matrix neon green grid
          lineMat.color.setHex(0x10b981);
          pathLineMat.color.setHex(0x059669);
          particleMat.color.setHex(0x34d399);
        } else {
          // Standard cosmic indigo
          lineMat.color.setHex(0x312e81);
          pathLineMat.color.setHex(0x4f46e5);
          particleMat.color.setHex(0x818cf8);
        }
      }

      // Animate active waves
      for (let i = activeWaves.length - 1; i >= 0; i--) {
        const wave = activeWaves[i];
        wave.scale += wave.speed * 2.0;
        wave.opacity -= 0.038;
        wave.mesh.scale.set(wave.scale, wave.scale, 1);
        wave.mat.opacity = wave.opacity;

        if (wave.opacity <= 0.0) {
          brainGroup.remove(wave.mesh);
          wave.geo.dispose();
          wave.mat.dispose();
          activeWaves.splice(i, 1);
        }
      }

      // Animate sparks traveling along synapses
      for (let i = activeSignals.length - 1; i >= 0; i--) {
        const sig = activeSignals[i];
        sig.progress += sig.speed;

        const startIdx = sig.path[sig.currentHop];
        const endIdx = sig.path[sig.currentHop + 1];
        const startNode = nodes[startIdx];
        const endNode = nodes[endIdx];

        if (sig.progress >= 1.0) {
          sig.progress = 0.0;
          sig.currentHop++;

          if (sig.currentHop >= sig.path.length - 1) {
            // Reached path end
            brainGroup.remove(sig.mesh);
            sig.geo.dispose();
            sig.mat.dispose();
            
            if (sig.onComplete) {
              sig.onComplete();
            }
            activeSignals.splice(i, 1);
            continue;
          }
        }

        const p = sig.progress;
        const nx = startNode.x + (endNode.x - startNode.x) * p;
        const ny = startNode.y + (endNode.y - startNode.y) * p;
        const nz = startNode.z + (endNode.z - startNode.z) * p;

        const jitter = 0.015;
        sig.mesh.position.set(
          nx + (Math.random() - 0.5) * jitter,
          ny + (Math.random() - 0.5) * jitter,
          nz + (Math.random() - 0.5) * jitter
        );
      }

      // Slowly decay synapse line opacities back to baseline
      lineMat.opacity += (0.12 - lineMat.opacity) * 0.04;
      pathLineMat.opacity += (0.42 - pathLineMat.opacity) * 0.04;

      // Pulse nodes & decay scale bursts
      nodeObjects.forEach((group, index) => {
        const isPrimary = group.userData.isPrimary;
        if (isPrimary) {
          const isHovered = activeNode === group.userData.id;
          const targetScale = isHovered ? 1.35 : 1.0;
          
          group.scale.x += (targetScale - group.scale.x) * 0.1;
          group.scale.y += (targetScale - group.scale.y) * 0.1;
          group.scale.z += (targetScale - group.scale.z) * 0.1;

          const core = group.userData.coreMesh;
          const pulse = 1.0 + Math.sin(elapsedTime * 4.0 + index) * 0.06;
          core.scale.set(pulse, pulse, pulse);

          const pl = group.userData.pointLight;
          const targetIntensity = isHovered ? 4.0 : 1.8 + Math.sin(elapsedTime * 2.5 + index) * 0.35;
          pl.intensity += (targetIntensity - pl.intensity) * 0.15;
        } else {
          group.scale.x += (1.0 - group.scale.x) * 0.08;
          group.scale.y += (1.0 - group.scale.y) * 0.08;
          group.scale.z += (1.0 - group.scale.z) * 0.08;
        }
      });

      // Project the 4 primary world coordinates directly to 2D HTML overlays
      nodeData.forEach((node, idx) => {
        const el = tooltipRefs.current[idx];
        const group = nodeObjects[idx];
        if (!el || !group) return;

        group.getWorldPosition(tempV);
        tempV.y += 0.35; // Hover tooltip offset

        tempV.project(camera);

        const x = (tempV.x * 0.5 + 0.5) * width;
        const y = (tempV.y * -0.5 + 0.5) * height;

        el.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px)`;
      });

      // Project bottom terminal status bar coordinate at front edge of the brainstem
      if (statusRef.current) {
        tempV.set(0, -1.35, 0); // Ground position below brainstem
        tempV.project(camera);
        const sx = (tempV.x * 0.5 + 0.5) * width;
        const sy = (tempV.y * -0.5 + 0.5) * height;
        statusRef.current.style.transform = `translate(-50%, -50%) translate(${sx}px, ${sy}px)`;
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- 13. Resize Handler ---
    const handleResize = () => {
      width = container.clientWidth;
      height = container.clientHeight || 520;

      renderer.setSize(width, height);
      
      const newAspect = width / height;
      camera.left = -d * newAspect;
      camera.right = d * newAspect;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    // Clean up all resources
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('lead-submitted', handleFormSubmit);
      clearInterval(idleTimer);
      
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('wheel', onWheel);
      
      renderer.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      pathLineGeo.dispose();
      pathLineMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();

      nodeObjects.forEach(group => {
        group.children.forEach(child => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        });
      });
      activeSignals.forEach(s => {
        s.geo.dispose();
        s.mat.dispose();
      });
      activeWaves.forEach(w => {
        w.geo.dispose();
        w.mat.dispose();
      });
    };
  }, []);

  return (
    <div className="three-visual-container" ref={containerRef}>
      {/* Three.js canvas */}
      <canvas className="three-canvas" ref={canvasRef} />

      {/* Floating HTML Projective Overlay Tooltips */}
      {nodeData.map((node, idx) => (
        <div
          key={node.id}
          ref={(el) => (tooltipRefs.current[idx] = el)}
          className={`projective-tooltip ${activeNode === node.id ? 'active' : ''}`}
          style={{ '--theme-color': node.color }}
        >
          <div className="tooltip-header">
            <span className="tooltip-tag">[{node.tag}]</span>
            <div className="tooltip-icon" style={{ color: node.color }}>
              {node.icon}
            </div>
          </div>
          <div className="tooltip-title">{node.title}</div>
          <div className="tooltip-desc">{node.desc}</div>
          <div className="tooltip-pointer" />
        </div>
      ))}

      {/* Interactive Control Dashboard Panel Overlay */}
      <div className="brain-dashboard-panel glassmorphic-panel">
        <div className="dashboard-header">
          <Activity size={14} className="dashboard-pulse-icon" />
          <span>NEURAL WORKFLOW CORE</span>
        </div>

        <div className="dashboard-stat-row">
          <span className="stat-label">Cognition Load:</span>
          <span className={`stat-value ${cognitiveState !== 'RESTING POTENTIAL' ? 'active' : ''}`}>
            {cognitiveState}
          </span>
        </div>

        <div className="dashboard-buttons">
          <button 
            className="btn-dashboard" 
            onClick={handleNeuralStorm}
            title="Fire coordinate action potential storms across synapses"
          >
            <Zap size={11} /> Storm Pulse
          </button>
          <button 
            className="btn-dashboard" 
            onClick={handleInjectStimulus}
            title="Inject random chemical synapse electric impulse"
          >
            <Activity size={11} /> Stimulate
          </button>
        </div>

        <div className="dashboard-toggle-row">
          <span className="toggle-label">
            {scanMode ? <Eye size={12} className="toggle-icon-label" /> : <EyeOff size={12} className="toggle-icon-label" />}
            Scan Matrix
          </span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={scanMode} 
              onChange={handleToggleScan} 
            />
            <span className="slider round"></span>
          </label>
        </div>
        
        <div className="dashboard-drag-hint">
          Drag to Rotate • Scroll to Zoom
        </div>
      </div>

      {/* Bottom Status Board */}
      <div className="three-status-board" ref={statusRef}>
        <Terminal size={14} className="status-terminal-icon" />
        <span>Brainwaves listening on <code>/api/submissions</code></span>
        <span className="status-blink" />
      </div>
    </div>
  );
}
