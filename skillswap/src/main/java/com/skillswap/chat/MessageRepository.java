package com.skillswap.chat;

import com.skillswap.swap.SwapRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findBySwapOrderByCreatedAtAsc(SwapRequest swap);
}
