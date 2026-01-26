package com.skillswap.swap;

import com.skillswap.skill.Skill;
import com.skillswap.user.User;
import jakarta.persistence.*;

@Entity
@Table(name = "swap_requests")
public class SwapRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Who sent the request
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    // Who receives the request
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    // Skill being requested
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SwapStatus status;

    public SwapRequest() {}

    public SwapRequest(User sender, User receiver, Skill skill, SwapStatus status) {
        this.sender = sender;
        this.receiver = receiver;
        this.skill = skill;
        this.status = status;
    }

    public Long getId() { return id; }
    public User getSender() { return sender; }
    public User getReceiver() { return receiver; }
    public Skill getSkill() { return skill; }
    public SwapStatus getStatus() { return status; }

    public void setStatus(SwapStatus status) {
        this.status = status;
    }
}
