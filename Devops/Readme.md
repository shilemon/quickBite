# 🍔 QuickBite — Full-Stack DevOps Project

<div align="center">

![QuickBite Architecture](https://img.shields.io/badge/Architecture-Microservices-blue?style=for-the-badge)
![Kubernetes](https://img.shields.io/badge/Kubernetes-1.34-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)
![AWS EKS](https://img.shields.io/badge/AWS-EKS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![ArgoCD](https://img.shields.io/badge/ArgoCD-GitOps-EF7B4D?style=for-the-badge&logo=argo&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI/CD-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Helm](https://img.shields.io/badge/Helm-Charts-0F1689?style=for-the-badge&logo=helm&logoColor=white)

**A production-grade food ordering application with a complete CI/CD pipeline, GitOps deployment, and Kubernetes orchestration on AWS EKS.**

[Architecture](#-architecture) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [CI/CD Pipeline](#-cicd-pipeline) · [Kubernetes](#-kubernetes-deployment) · [Monitoring](#-monitoring)

</div>

---

## 📌 Project Overview

QuickBite is a full-stack food ordering web application built with a **production-grade DevOps pipeline**. This project demonstrates real-world implementation of:

- **Containerization** with Docker multi-stage builds
- **CI/CD automation** with GitHub Actions
- **Security scanning** with Trivy CVE gate
- **GitOps deployment** with ArgoCD + Helm
- **Kubernetes orchestration** on AWS EKS
- **Auto-scaling** with Horizontal Pod Autoscaler (HPA)
- **Observability** with Prometheus + Grafana

---

## 🏗️ Architecture

```
Developer
    │
    │  git push origin main
    ▼
┌─────────────────────────────────────────────────────────────┐
│              GitHub Actions CI Pipeline                      │
│                                                             │
│  npm build → Docker Build → Trivy Scan → Push DockerHub    │
│                                    └──→ Update Helm Tag     │
└─────────────────────────────────────────────────────────────┘
    │
    │  Auto-commit: values-stg.yaml tag updated [skip ci]
    ▼
┌──────────┐    watches     ┌──────────┐
│   HELM   │ ◄──────────── │  ArgoCD  │
│  Chart   │               │  GitOps  │
└──────────┘               └──────────┘
                                │
              ┌─────────────────┼─────────────────┐
              │ auto-sync       │                 │ manual sync
              ▼                 │                 ▼
    ┌─────────────────┐         │       ┌──────────────────┐
    │    STAGING      │         │       │   PRODUCTION     │
    │  quickbite-stg  │         │       │  quickbite-prod  │
    └─────────────────┘         │       └──────────────────┘
              │                 │                 │
              └─────────────────┼─────────────────┘
                                ▼
                    ┌────────────────────┐
                    │   AWS EKS Cluster  │
                    │  quickbite-cluster │
                    │   ap-south-1       │
                    └────────────────────┘
                                │
                    ┌───────────┴────────────┐
                    │                        │
                    ▼                        ▼
            ┌──────────────┐      ┌─────────────────────┐
            │   AWS NLB    │      │   NGINX Ingress      │
            │ Load Balancer│─────▶│   Controller         │
            └──────────────┘      │  /       → frontend  │
                    ▲             │  /api    → backend   │
                    │             │  /admin  → admin     │
                 End Users        └─────────────────────┘
```

---

## 🛠️ Tech Stack

### Application
| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Admin Panel | React 18 + Vite |
| Backend API | Node.js + Express.js |
| Database | MongoDB 7.0 |

### DevOps & Infrastructure
| Tool | Purpose |
|------|---------|
| **Docker** | Multi-stage containerization |
| **GitHub Actions** | CI pipeline automation |
| **Trivy** | CVE security scanning |
| **DockerHub** | Container image registry |
| **Helm** | Kubernetes package management |
| **ArgoCD** | GitOps continuous delivery |
| **AWS EKS** | Managed Kubernetes (v1.34) |
| **AWS EBS** | Persistent storage for MongoDB |
| **AWS NLB** | Network Load Balancer |
| **NGINX Ingress** | Path-based traffic routing |
| **Prometheus** | Metrics collection |
| **Grafana** | Dashboards & visualization |
| **Alertmanager** | Slack/email alerting |

---

## 📁 Repository Structure

```
quickBite/
├── .github/
│   └── workflows/
│       ├── ci-frontend.yml      # Frontend CI pipeline
│       ├── ci-admin.yml         # Admin CI pipeline
│       └── ci-backend.yml       # Backend CI pipeline
│
├── Frontend/                    # React customer app
│   ├── src/
│   ├── Dockerfile               # Multi-stage build
│   └── package.json
│
├── Admin/                       # React admin dashboard
│   ├── src/
│   ├── Dockerfile
│   └── package.json
│
├── Backend/                     # Express.js REST API
│   ├── src/
│   ├── Dockerfile
│   └── package.json
│
├── helm/
│   └── quickbite/               # Helm chart
│       ├── Chart.yaml
│       ├── values.yaml          # Base values
│       ├── values-stg.yaml      # Staging overrides (image tags updated by CI)
│       ├── values-prod.yaml     # Production overrides
│       └── templates/
│           ├── deployment.yaml
│           ├── service.yaml
│           ├── ingress.yaml
│           ├── hpa.yaml
│           ├── secret.yaml
│           └── mongodb-statefulset.yaml
│
└── k8s/
    └── argocd/
        ├── app-staging.yml      # ArgoCD staging application
        └── app-prod.yml         # ArgoCD production application
```

---

## 🚀 Getting Started

### Prerequisites

```bash
# Required tools
aws --version        # AWS CLI v2
kubectl version      # kubectl
helm version         # Helm v3
eksctl version       # eksctl
argocd version       # ArgoCD CLI
docker --version     # Docker
```

### 1. Clone the Repository

```bash
git clone https://github.com/shilemon/quickBite.git
cd quickBite
```

### 2. Configure AWS

```bash
aws configure
# AWS Access Key ID: <your-key>
# AWS Secret Access Key: <your-secret>
# Default region: ap-south-1
# Output format: json
```

### 3. Create EKS Cluster

```bash
eksctl create cluster \
  --name quickbite-cluster \
  --region ap-south-1 \
  --nodegroup-name quickbite-nodes \
  --node-type t3.large \
  --nodes 2 \
  --nodes-min 2 \
  --nodes-max 4

# Update kubeconfig
aws eks update-kubeconfig \
  --region ap-south-1 \
  --name quickbite-cluster
```

### 4. Install EBS CSI Driver

```bash
# Required for MongoDB persistent storage
eksctl create addon \
  --name aws-ebs-csi-driver \
  --cluster quickbite-cluster \
  --region ap-south-1 \
  --force
```

### 5. Create Storage Class

```bash
cat <<EOF | kubectl apply -f -
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: gp2-immediate
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp2
  fsType: ext4
reclaimPolicy: Delete
volumeBindingMode: Immediate
allowVolumeExpansion: true
EOF
```

### 6. Create Namespaces

```bash
kubectl create namespace quickbite-staging
kubectl create namespace quickbite-prod
kubectl create namespace argocd
kubectl create namespace monitoring
```

### 7. Create Secrets

```bash
# Staging
kubectl create secret generic quickbite-secrets \
  --namespace quickbite-staging \
  --from-literal=MONGO_URI="mongodb://quickbite-staging-mongodb:27017/quickbite" \
  --from-literal=JWT_SECRET="your-jwt-secret-here" \
  --from-literal=STRIPE_SECRET_KEY="sk_test_your_stripe_key"

# Production
kubectl create secret generic quickbite-secrets \
  --namespace quickbite-prod \
  --from-literal=MONGO_URI="mongodb://quickbite-prod-mongodb:27017/quickbite" \
  --from-literal=JWT_SECRET="your-jwt-secret-here" \
  --from-literal=STRIPE_SECRET_KEY="sk_live_your_stripe_key"
```

### 8. Install NGINX Ingress Controller

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.service.type=LoadBalancer
```

### 9. Install ArgoCD

```bash
kubectl apply -n argocd \
  -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Access ArgoCD UI
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Get initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d
```

### 10. Apply ArgoCD Applications

```bash
kubectl apply -f k8s/argocd/app-staging.yml
kubectl apply -f k8s/argocd/app-prod.yml
```

### 11. Configure GitHub Actions Secrets

In your GitHub repo → Settings → Secrets and variables → Actions, add:

| Secret | Value |
|--------|-------|
| `DOCKER_USERNAME` | `emon110852` |
| `DOCKER_PASSWORD` | Your DockerHub password/token |

Also enable: Settings → Actions → General → **Read and write permissions**

---

## ⚙️ CI/CD Pipeline

### Pipeline Flow

```
git push origin main
        │
        ▼ (path filter triggers)
┌───────────────────────────────────────┐
│         GitHub Actions                │
│                                       │
│  1. actions/checkout@v4               │
│  2. Setup Node.js 20                  │
│  3. npm ci                            │
│  4. npm run build (Vite)              │
│  5. Docker multi-stage build          │
│     ├── Stage 1: node:20-alpine       │
│     │   └── npm run build             │
│     └── Stage 2: nginx:1.27-alpine    │
│         └── COPY dist/ → /usr/share   │
│  6. Trivy CVE scan (CRITICAL/HIGH)    │
│  7. Push to DockerHub                 │
│     └── tag: <git-sha>                │
│  8. Update values-stg.yaml            │
│     └── git commit [skip ci]          │
│     └── git push (retry logic)        │
└───────────────────────────────────────┘
        │
        ▼
   ArgoCD detects change → Auto-deploy staging
```

### Pipeline Files

**`.github/workflows/ci-frontend.yml`** — triggered on `push` to `Frontend/**`  
**`.github/workflows/ci-admin.yml`** — triggered on `push` to `Admin/**`  
**`.github/workflows/ci-backend.yml`** — triggered on `push` to `Backend/**`

### Image Naming Convention

```
emon110852/quickbite-frontend:<git-sha>
emon110852/quickbite-admin:<git-sha>
emon110852/quickbite-backend:<git-sha>
```

---

## ☸️ Kubernetes Deployment

### Cluster Info

| Property | Value |
|----------|-------|
| Cluster Name | `quickbite-cluster` |
| Region | `ap-south-1` (Mumbai) |
| Node Type | `t3.large` |
| Node Count | 2 (AZ: ap-south-1a, ap-south-1c) |
| Kubernetes Version | 1.34 |

### Environments

#### 🟢 Staging (`quickbite-staging`)

| Service | Replicas | Port | HPA |
|---------|----------|------|-----|
| Frontend | 1 | 80 | 1 → 2 |
| Admin | 1 | 80 | off |
| Backend | 1 | 4000 | 1 → 3 |
| MongoDB | 1 (StatefulSet) | 27017 | — |

**Storage:** AWS EBS 2Gi · `gp2-immediate`  
**URL:** `http://staging.quickbite.internal` → `13.234.123.98`  
**Deploy:** Automatic (ArgoCD auto-sync)

#### 🔴 Production (`quickbite-prod`)

| Service | Replicas | Port | HPA |
|---------|----------|------|-----|
| Frontend | 2 | 80 | 2 → 5 |
| Admin | 2 | 80 | 1 → 3 |
| Backend | 3 | 4000 | 3 → 8 |
| MongoDB | 1 (StatefulSet) | 27017 | — |

**Storage:** AWS EBS 10Gi · `gp2`  
**URL:** `http://prod.quickbite.internal` → `13.234.123.98`  
**Deploy:** Manual (ArgoCD sync required)

### NGINX Ingress Routing

```
http://staging.quickbite.internal/        → Frontend  :80
http://staging.quickbite.internal/api     → Backend   :4000
http://staging.quickbite.internal/admin   → Admin     :80

http://prod.quickbite.internal/           → Frontend  :80
http://prod.quickbite.internal/api        → Backend   :4000
http://prod.quickbite.internal/admin      → Admin     :80
```

### Local DNS Setup (Windows)

To access via friendly URLs, add to `C:\Windows\System32\drivers\etc\hosts`:

```
13.234.123.98   staging.quickbite.internal
13.234.123.98   prod.quickbite.internal
```

> Open Notepad as Administrator → File → Open → paste path → add entries → Save

---

## 🔄 GitOps with ArgoCD

### How It Works

```
1. CI pushes new image tag to DockerHub
2. CI updates values-stg.yaml: tag: <new-sha>
3. CI commits with [skip ci] flag → Git
4. ArgoCD polls Git every 3 minutes
5. ArgoCD detects diff in values-stg.yaml
6. ArgoCD renders Helm chart with new values
7. ArgoCD applies manifests to EKS
8. Kubernetes performs rolling update → Zero downtime
```

### ArgoCD Applications

| App | Namespace | Sync | Prune | SelfHeal |
|-----|-----------|------|-------|----------|
| `quickbite-staging` | `quickbite-staging` | Automatic | ✅ | ✅ |
| `quickbite-prod` | `quickbite-prod` | Manual | ✅ | ❌ |

### Deploy to Production

```bash
# Option 1: ArgoCD CLI
argocd app sync quickbite-prod

# Option 2: ArgoCD UI
# Open ArgoCD UI → quickbite-prod → Click SYNC

# Option 3: kubectl
kubectl apply -f k8s/argocd/app-prod.yml
```

---

## 📊 Monitoring

### Stack

```
Node Exporter ──┐
                ├──▶ Prometheus ──▶ Grafana (dashboards)
AWS EKS ────────┘         │
                          └──▶ Alertmanager ──▶ Slack / Email
```

### Install Monitoring Stack

```bash
helm repo add prometheus-community \
  https://prometheus-community.github.io/helm-charts
helm repo update

helm install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace
```

### Access Grafana

```bash
kubectl port-forward svc/monitoring-grafana -n monitoring 3000:80
# Username: admin
# Password: prom-operator
```

---

## 🔒 Security

- **Trivy** scans every Docker image for CVE vulnerabilities before push
- **CRITICAL** and **HIGH** severity vulnerabilities **block** the pipeline
- Kubernetes **Secrets** used for sensitive data (JWT, MongoDB URI, Stripe)
- Secrets stored via `kubectl create secret` — never committed to Git
- ArgoCD configured with `ignoreDifferences` for secret data fields

---

## 🐛 Troubleshooting

### Check Pod Status
```bash
kubectl get pods -n quickbite-staging
kubectl get pods -n quickbite-prod
```

### View Logs
```bash
# Backend logs
kubectl logs -l app=quickbite-staging-backend -n quickbite-staging --tail=50

# MongoDB logs
kubectl logs quickbite-staging-mongodb-0 -n quickbite-staging --tail=30
```

### Check ArgoCD Sync Status
```bash
kubectl get applications -n argocd
argocd app get quickbite-staging
```

### Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| `PVC Pending` | EBS CSI driver missing | `eksctl create addon --name aws-ebs-csi-driver` |
| `ImagePullBackOff` | Wrong image tag format | Check CI workflow `IMAGE_TAG` output format |
| `CrashLoopBackOff` | MongoDB not ready | Wait for MongoDB pod to be `1/1 Running` |
| `git push rejected` | CI race condition | Retry logic with `git pull --rebase` in workflow |
| `OutOfSync` on secrets | ArgoCD diff on secret data | Add `ignoreDifferences` in ArgoCD app manifest |
| `volumeBindingMode immutable` | Can't patch StorageClass | Create new StorageClass `gp2-immediate` |

---

## 📋 Useful Commands

```bash
# ── Cluster ──────────────────────────────────────────────────
kubectl get nodes -o wide
kubectl get all -n quickbite-staging
kubectl get all -n quickbite-prod

# ── ArgoCD ───────────────────────────────────────────────────
kubectl get applications -n argocd
argocd app sync quickbite-staging
argocd app sync quickbite-prod

# ── Ingress / Networking ─────────────────────────────────────
kubectl get ingress -n quickbite-staging
kubectl get svc -n ingress-nginx
kubectl get svc -n quickbite-staging

# ── HPA ──────────────────────────────────────────────────────
kubectl get hpa -n quickbite-staging
kubectl get hpa -n quickbite-prod

# ── Storage ──────────────────────────────────────────────────
kubectl get pvc -n quickbite-staging
kubectl get pvc -n quickbite-prod
kubectl get storageclass

# ── Monitoring ───────────────────────────────────────────────
kubectl get pods -n monitoring
kubectl port-forward svc/monitoring-grafana -n monitoring 3000:80

# ── Test endpoints ───────────────────────────────────────────
curl http://staging.quickbite.internal/
curl http://staging.quickbite.internal/api/health
curl http://staging.quickbite.internal/admin
```

---

## 🌐 Application URLs

| Environment | URL | IP |
|-------------|-----|----|
| 🟢 Staging Frontend | `http://staging.quickbite.internal/` | `13.234.123.98` |
| 🟢 Staging API | `http://staging.quickbite.internal/api` | `13.234.123.98` |
| 🟢 Staging Admin | `http://staging.quickbite.internal/admin` | `13.234.123.98` |
| 🔴 Prod Frontend | `http://prod.quickbite.internal/` | `13.234.123.98` |
| 🔴 Prod API | `http://prod.quickbite.internal/api` | `13.234.123.98` |
| 🔴 Prod Admin | `http://prod.quickbite.internal/admin` | `13.234.123.98` |

---

## 📦 Docker Images

| Image | Registry | Tags |
|-------|----------|------|
| Frontend | `emon110852/quickbite-frontend` | `<git-sha>`, `latest` |
| Admin | `emon110852/quickbite-admin` | `<git-sha>`, `latest` |
| Backend | `emon110852/quickbite-backend` | `<git-sha>`, `latest` |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m 'feat: add some feature'`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Built with ❤️ by emon110852**

![AWS](https://img.shields.io/badge/AWS-EKS-FF9900?style=flat&logo=amazonaws)
![Kubernetes](https://img.shields.io/badge/Kubernetes-1.34-326CE5?style=flat&logo=kubernetes)
![ArgoCD](https://img.shields.io/badge/ArgoCD-GitOps-EF7B4D?style=flat&logo=argo)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb)

</div>