package com.skillswap.skill;

import com.skillswap.user.User;
import jakarta.persistence.*;

@Entity
@Table(name = "skills")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    // OFFER / LEARN
    @Column(nullable = false)
    private String type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ✅ SOFT DELETE: Track if skill is active (not deleted)
    @Column(nullable = false, columnDefinition = "boolean default true")
    private boolean isActive = true;

    // ✅ SKILL LOCKING: Track if skill is locked in an approved swap
    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean isLocked = false;

    public Skill() {
    }

    public Skill(String name, String type, User user) {
        this.name = name;
        this.type = type;
        this.user = user;
        this.isActive = true;
        this.isLocked = false;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    public User getUser() {
        return user;
    }

    public boolean isActive() {
        return isActive;
    }

    public boolean isLocked() {
        return isLocked;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public void setLocked(boolean locked) {
        isLocked = locked;
    }
}
