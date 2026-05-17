---
title: "Split Learning: Privacy-Preserving Distributed Deep Learning"
date: "2025-04-15"
readTime: "8 min read"
excerpt: "An in-depth look at Vanilla SL, U-Shaped SL, and SplitFed how they distribute model layers across clients and servers to keep raw data local while still training powerful neural networks."
tags: ["Distributed ML", "Privacy", "Deep Learning"]
coverImage: "/images/slperf-project.png"
---

## The Problem with Federated Learning

Federated Learning made a compelling promise: train a global model across many devices without centralizing raw data. Clients keep their data local, compute local gradients, and only share model updates. Privacy solved or so it seemed.

The reality is more nuanced. Gradient inversion attacks have demonstrated that raw training samples can be reconstructed from gradient updates with alarming fidelity. The update itself becomes a privacy vector. This is where **Split Learning** enters as a complementary paradigm.

## What Is Split Learning?

Split Learning (SL), introduced by Gupta and Ramsundar at MIT, cuts the neural network at a designated **split layer**. Everything before the split runs on the client; everything after runs on a server. Instead of sending gradients or model weights, the client sends only the intermediate tensor at the split point called the **smashed data** or **cut layer activations**.

The server:
1. Receives the smashed data
2. Completes the forward pass through its layers
3. Computes the loss
4. Backpropagates gradients back to the split point
5. Returns the gradient of the cut layer to the client

The client then backpropagates through its local layers. Raw data never leaves the device.

## Three Architectures

### Vanilla Split Learning

The simplest form. One split point, one client at a time communicates with the server. Clients take turns sequential, not parallel.

```
Client A:  [Input → Layer 1 → Layer 2 → CUT] ──smashed──▶  Server: [Layer 3 → ... → Output → Loss]
                                                ◀──grad──
```

**Trade-off:** Low communication cost per round, but sequential processing means training time scales linearly with the number of clients.

### U-Shaped Split Learning

Adds a second cut point at the *end* of the network. Both the first and last layers run on the client, with the entire middle on the server.

```
Client:  [Input → Head Layers → CUT₁] ──▶  Server: [Middle] ──▶  Client: [CUT₂ → Tail → Loss]
```

This keeps the label information on the client side the server never sees labels, which is a significant privacy improvement over Vanilla SL. Critical for medical or financial applications where class labels are as sensitive as the raw input.

### SplitFed Learning

The hybrid of Federated Learning and Split Learning. Multiple clients train in parallel (federated style), each with their own local head. The server aggregates client-side model updates using FedAvg while simultaneously hosting the server-side tail.

```
Client A: [Head_A → smashed_A] ─┐
Client B: [Head_B → smashed_B] ─┼──▶  Server: [Shared Tail → Loss]
Client C: [Head_C → smashed_C] ─┘
    │
    └── FedAvg on Head weights periodically
```

SplitFed recovers the parallelism that Vanilla SL loses, at the cost of more complex orchestration and higher server-side memory (batching multiple clients' smashed data simultaneously).

## The SLPerf Benchmark

My master's thesis, **SLPerf**, benchmarks these three architectures under controlled conditions:

- **Tasks:** Vision (CIFAR-10 with ResNet), Graph classification (TUDataset with GIN)
- **Data distributions:** IID (uniform class distribution) and non-IID (Dirichlet-sampled, α = 0.5)
- **Communication:** MPI (`mpi4py`) for distributed process coordination
- **Metrics:** Test accuracy, communication rounds to convergence, wall-clock time

### Key findings

| Architecture | IID Accuracy | non-IID Accuracy | Comm. Rounds |
|---|---|---|---|
| Vanilla SL | 91.2% | 84.7% | 120 |
| U-Shaped SL | 90.1% | 83.9% | 135 |
| SplitFed | 92.4% | 88.3% | 95 |

Non-IID data distribution is the critical variable. SplitFed's periodic head aggregation acts as a regularizer against client drift the same mechanism that makes FedAvg superior to isolated local training under heterogeneous data.

U-Shaped SL shows slightly lower accuracy because the gradient path through two cuts introduces additional vanishing gradient risk, particularly with deeper networks and a small local head.

## Implementation Notes

One underappreciated challenge: **gradient synchronization under MPI**. When the server returns the cut-layer gradient to the client, it must do so per-sample in the current mini-batch, not as an aggregate. Naive all-reduce operations average gradients which is wrong here. Point-to-point `MPI.Send` / `MPI.Recv` is required for correctness.

```python
# Server sends gradient back to specific client
if rank == SERVER_RANK:
    comm.Send(cut_grad.numpy(), dest=client_rank, tag=GRAD_TAG)

# Client receives its gradient
if rank == client_rank:
    buf = np.empty(cut_shape, dtype=np.float32)
    comm.Recv(buf, source=SERVER_RANK, tag=GRAD_TAG)
    cut_tensor.backward(torch.from_numpy(buf))
```

## Limitations and Open Problems

Split Learning is not a silver bullet. The smashed data can still leak information especially when the split layer is early and the head network is shallow. Deep Leakage from Smashed Data (DLSD) attacks have shown that inversion is possible under certain conditions.

Active research areas include:
- **Noisy smashed data:** Adding differential privacy noise at the cut point
- **Adversarial split point selection:** Choosing splits that maximize information loss
- **Asynchronous SplitFed:** Eliminating the synchronization barrier between rounds

The interplay between privacy, accuracy, and communication efficiency remains an open and practically important problem.

---

*This post is based on my master's thesis research conducted at the University of Milano-Bicocca. The full SLPerf benchmark code is available on [GitHub](https://github.com/SameulAH/SLPerf).*
