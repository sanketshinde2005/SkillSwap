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

    public Skill() {}

    public Skill(String name, String type, User user) {
        this.name = name;
        this.type = type;
        this.user = user;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getType() { return type; }
    public User getUser() { return user; }
}
