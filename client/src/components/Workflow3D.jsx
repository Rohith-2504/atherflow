import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { MessageSquare, Cpu, Database, Zap, Terminal } from 'lucide-react';
import './Workflow3D.css';

export default function Workflow3D() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Tooltip DOM references to update positions directly without React lag
  const tooltipRefs = useRef([]);
  const statusRef = useRef(null);

  const [activeNode, setActiveNode] = useState(null);

  const nodeData = [
    {
      id: 1,
      title: 'Lead Captured',
      tag: 'LIVE FEED',
      desc: 'Lead captured via /api/submissions',
      icon: <MessageSquare size={14} />,
      color: '#06b6d4', // Cyan
      pos: { x: -2, y: 0.4, z: -2 }
    },
    {
      id: 2,
      title: 'AI Classifier',
      tag: 'AI PROCESSING',
      desc: "Urgency: High - Tagged: 'Enterprise Lead'",
      icon: <Cpu size={14} />,
      color: '#7c3aed', // Purple
      pos: { x: -2, y: 0.4, z: 2 }
    },
    {
      id: 3,
      title: 'SQLite Database',
      tag: 'DATABASE ENTRY',
      desc: 'Row inserted in B:\\pmwlf\\server\\data',
      icon: <Database size={14} />,
      color: '#10b981', // Teal
      pos: { x: 2, y: 0.4, z: 2 }
    },
    {
      id: 4,
      title: 'Auto-Response',
      tag: 'AUTO-EXECUTION',
      desc: 'Email sent & Slack alert dispatched',
      icon: <Zap size={14} />,
      color: '#f59e0b', // Amber
      pos: { x: 2, y: 0.4, z: -2 }
    }
  ];

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    let width = container.clientWidth;
    let height = container.clientHeight || 500;

    // --- 1. Scene Setup ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040508, 0.08);

    // --- 2. Camera Setup (Orthographic for Isometric View) ---
    const aspect = width / height;
    const d = 4.2;
    const camera = new THREE.OrthographicCamera(
      -d * aspect,
      d * aspect,
      d,
      -d,
      1,
      1000
    );
    // Standard isometric camera angle (45 deg Y, 35.26 deg X)
    camera.position.set(15, 13.5, 15);
    camera.lookAt(0, 0, 0);

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(5, 15, 5);
    scene.add(dirLight);

    // Point lights for colorful volumetric glows matching node positions
    const lights = nodeData.map((node) => {
      const pl = new THREE.PointLight(node.color, 1.8, 8);
      pl.position.set(node.pos.x, node.pos.y, node.pos.z);
      scene.add(pl);
      return pl;
    });

    // --- 5. Base Platform (Extruded Glass Board) ---
    const platformGeo = new THREE.BoxGeometry(6.5, 0.3, 6.5);
    const platformMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f111a,
      roughness: 0.2,
      metalness: 0.1,
      transmission: 0.6,
      thickness: 1.2,
      transparent: true,
      opacity: 0.85
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = -0.15;
    scene.add(platform);

    // Platform Border Glow (Faint wireframe)
    const platformWireGeo = new THREE.BoxGeometry(6.52, 0.32, 6.52);
    const platformWireMat = new THREE.MeshBasicMaterial({
      color: 0x1e293b,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const platformWire = new THREE.Mesh(platformWireGeo, platformWireMat);
    platformWire.position.y = -0.15;
    scene.add(platformWire);

    // --- 6. Isometric Base Grid Floor ---
    const gridLines = new THREE.Group();
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.05
    });

    const gridSize = 6;
    const gridDivisions = 12;
    const step = gridSize / gridDivisions;

    for (let i = -gridDivisions / 2; i <= gridDivisions / 2; i++) {
      // Lines along X
      const pointsX = [];
      pointsX.push(new THREE.Vector3(-gridSize / 2, 0.01, i * step));
      pointsX.push(new THREE.Vector3(gridSize / 2, 0.01, i * step));
      const geoX = new THREE.BufferGeometry().setFromPoints(pointsX);
      const lineX = new THREE.Line(geoX, lineMat);
      gridLines.add(lineX);

      // Lines along Z
      const pointsZ = [];
      pointsZ.push(new THREE.Vector3(i * step, 0.01, -gridSize / 2));
      pointsZ.push(new THREE.Vector3(i * step, 0.01, gridSize / 2));
      const geoZ = new THREE.BufferGeometry().setFromPoints(pointsZ);
      const lineZ = new THREE.Line(geoZ, lineMat);
      gridLines.add(lineZ);
    }
    scene.add(gridLines);

    // --- 7. Node Meshes Creation ---
    const nodeMeshes = [];
    nodeData.forEach((node) => {
      const nodeGroup = new THREE.Group();
      nodeGroup.position.set(node.pos.x, node.pos.y, node.pos.z);
      nodeGroup.userData = { id: node.id, color: node.color };

      // Outer glass capsule box
      const outerGeo = new THREE.BoxGeometry(1.1, 0.6, 1.1);
      const outerMat = new THREE.MeshPhysicalMaterial({
        color: 0x0f172a,
        roughness: 0.1,
        metalness: 0.2,
        transmission: 0.4,
        thickness: 0.5,
        transparent: true,
        opacity: 0.7,
        clearcoat: 1.0
      });
      const outerMesh = new THREE.Mesh(outerGeo, outerMat);
      nodeGroup.add(outerMesh);

      // Glowing Core Cube
      const coreGeo = new THREE.BoxGeometry(0.45, 0.3, 0.45);
      const coreMat = new THREE.MeshBasicMaterial({
        color: node.color,
        transparent: true,
        opacity: 0.8
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.position.y = 0.05;
      nodeGroup.add(coreMesh);

      // Metal base rim
      const baseRimGeo = new THREE.BoxGeometry(1.12, 0.08, 1.12);
      const baseRimMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.5,
        metalness: 0.8
      });
      const baseRim = new THREE.Mesh(baseRimGeo, baseRimMat);
      baseRim.position.y = -0.3;
      nodeGroup.add(baseRim);

      scene.add(nodeGroup);
      nodeMeshes.push(nodeGroup);
    });

    // --- 8. Animated Connection Pipelines & Data Packets ---
    const connections = [
      { from: 0, to: 1 }, // Node 1 -> Node 2
      { from: 1, to: 2 }, // Node 2 -> Node 3
      { from: 1, to: 3 }  // Node 2 -> Node 4
    ];

    const curves = [];
    const packetMeshes = [];

    connections.forEach((conn) => {
      const fromNode = nodeData[conn.from];
      const toNode = nodeData[conn.to];

      // Draw curved s-shape pipelines using CatmullRomCurve3
      const start = new THREE.Vector3(fromNode.pos.x, 0.35, fromNode.pos.z);
      const end = new THREE.Vector3(toNode.pos.x, 0.35, toNode.pos.z);
      
      // Control points for nice orthogonal curves
      const mid1 = new THREE.Vector3(start.x, 0.35, end.z);
      
      const curve = new THREE.CatmullRomCurve3([start, mid1, end]);
      curves.push(curve);

      // Draw pipeline wire geometry
      const pipeGeo = new THREE.TubeGeometry(curve, 20, 0.05, 8, false);
      const pipeMat = new THREE.MeshBasicMaterial({
        color: 0x334155,
        transparent: true,
        opacity: 0.25,
        wireframe: true
      });
      const pipeMesh = new THREE.Mesh(pipeGeo, pipeMat);
      scene.add(pipeMesh);

      // Spherical animated packet mesh
      const packetGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const packetMat = new THREE.MeshBasicMaterial({
        color: toNode.color,
        transparent: true,
        opacity: 0.9
      });
      const packet = new THREE.Mesh(packetGeo, packetMat);
      scene.add(packet);
      
      packetMeshes.push({
        mesh: packet,
        curve,
        progress: Math.random(), // Offset progress start
        speed: 0.005 + Math.random() * 0.004,
        color: toNode.color
      });
    });

    // --- 9. Raycaster Hover Handler ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      let foundIntersect = null;
      for (let i = 0; i < intersects.length; i++) {
        let parent = intersects[i].object.parent;
        while (parent && parent !== scene) {
          if (nodeMeshes.includes(parent)) {
            foundIntersect = parent;
            break;
          }
          parent = parent.parent;
        }
        if (foundIntersect) break;
      }

      if (foundIntersect) {
        const id = foundIntersect.userData.id;
        setActiveNode(id);
      } else {
        setActiveNode(null);
      }
    };

    container.addEventListener('mousemove', onMouseMove);

    // --- 10. Animation Loop & Tooltip Projection ---
    const tempV = new THREE.Vector3();
    let clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Animate platform node core glows
      nodeMeshes.forEach((mesh, index) => {
        const core = mesh.children[1];
        const baseRim = mesh.children[2];
        const scaleVal = 1 + Math.sin(elapsedTime * 3 + index) * 0.06;
        core.scale.set(scaleVal, scaleVal, scaleVal);

        // Hover scale up
        const isHovered = activeNode === mesh.userData.id;
        const targetScale = isHovered ? 1.12 : 1.0;
        mesh.scale.x += (targetScale - mesh.scale.x) * 0.15;
        mesh.scale.y += (targetScale - mesh.scale.y) * 0.15;
        mesh.scale.z += (targetScale - mesh.scale.z) * 0.15;

        // Animate light intensity dynamically based on hover
        lights[index].intensity = isHovered ? 3.0 : 1.8 + Math.sin(elapsedTime * 2 + index) * 0.3;
      });

      // Animate grid glowing pulse
      lineMat.opacity = 0.03 + Math.sin(elapsedTime) * 0.015;

      // Animate data packet flows along curves
      packetMeshes.forEach((p) => {
        p.progress += p.speed;
        if (p.progress > 1) {
          p.progress = 0;
        }
        const point = p.curve.getPointAt(p.progress);
        p.mesh.position.copy(point);

        // Add a pulsing trail glow scale
        const glowFactor = 1 + Math.sin(elapsedTime * 8) * 0.15;
        p.mesh.scale.set(glowFactor, glowFactor, glowFactor);
      });

      // Project 3D positions to 2D HTML Screen overlay positions
      nodeData.forEach((node, idx) => {
        const el = tooltipRefs.current[idx];
        if (!el) return;

        // Project coordinate
        tempV.set(node.pos.x, node.pos.y + 0.65, node.pos.z);
        tempV.project(camera);

        // Map to client pixel space
        const x = (tempV.x * 0.5 + 0.5) * width;
        const y = (tempV.y * -0.5 + 0.5) * height;

        // Position tooltip card directly
        el.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px)`;
      });

      // Project status bar coordinates at front edge
      if (statusRef.current) {
        tempV.set(0, 0, 3.2); // Front center edge
        tempV.project(camera);
        const sx = (tempV.x * 0.5 + 0.5) * width;
        const sy = (tempV.y * -0.5 + 0.5) * height;
        statusRef.current.style.transform = `translate(-50%, -50%) translate(${sx}px, ${sy}px)`;
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- 11. Resize Handler ---
    const handleResize = () => {
      width = container.clientWidth;
      height = container.clientHeight || 500;

      renderer.setSize(width, height);
      
      const newAspect = width / height;
      camera.left = -d * newAspect;
      camera.right = d * newAspect;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    // Clean up listeners
    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', onMouseMove);
      renderer.dispose();
      platformGeo.dispose();
      platformMat.dispose();
      platformWireGeo.dispose();
      platformWireMat.dispose();
      lineMat.dispose();
      gridLines.clear();
      nodeMeshes.forEach(mesh => {
        mesh.children.forEach(child => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        });
      });
      packetMeshes.forEach(p => {
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
      });
    };
  }, [activeNode]);

  return (
    <div className="three-visual-container" ref={containerRef}>
      <canvas className="three-canvas" ref={canvasRef} />

      {/* HTML Projective Overlay Tooltips */}
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

      {/* Bottom Status Board */}
      <div className="three-status-board" ref={statusRef}>
        <Terminal size={14} className="status-terminal-icon" />
        <span>Workflow listening on <code>/api/submissions</code></span>
        <span className="status-blink" />
      </div>
    </div>
  );
}
