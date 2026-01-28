package com.skillswap;

import com.skillswap.auth.dto.LoginRequest;
import com.skillswap.auth.dto.RegisterRequest;
import com.skillswap.auth.service.AuthService;
import com.skillswap.exception.custom.BadRequestException;
import com.skillswap.exception.custom.NotFoundException;
import com.skillswap.skill.Skill;
import com.skillswap.skill.SkillRepository;
import com.skillswap.skill.dto.SkillRequest;
import com.skillswap.skill.service.SkillService;
import com.skillswap.swap.SwapRequest;
import com.skillswap.swap.SwapRequestRepository;
import com.skillswap.swap.SwapStatus;
import com.skillswap.swap.dto.SwapRequestCreateDto;
import com.skillswap.swap.service.SwapService;
import com.skillswap.user.Role;
import com.skillswap.user.User;
import com.skillswap.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class CoreFlowIntegrationTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private SkillService skillService;

    @Autowired
    private SwapService swapService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private SwapRequestRepository swapRequestRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User student1;
    private User student2;
    private Skill skill1;
    private Skill skill2;

    @BeforeEach
    void setUp() {
        // Register two students
        RegisterRequest reg1 = new RegisterRequest("Alice", "alice@test.com", "password123", "STUDENT");
        RegisterRequest reg2 = new RegisterRequest("Bob", "bob@test.com", "password123", "STUDENT");

        authService.register(reg1);
        authService.register(reg2);

        student1 = userRepository.findByEmail("alice@test.com").orElseThrow();
        student2 = userRepository.findByEmail("bob@test.com").orElseThrow();

        // Create skills
        SkillRequest skillReq1 = new SkillRequest();
        skillReq1.setName("Java Programming");
        skillReq1.setType("OFFER");

        SkillRequest skillReq2 = new SkillRequest();
        skillReq2.setName("Web Design");
        skillReq2.setType("OFFER");

        skill1 = skillService.addSkill("alice@test.com", skillReq1);
        skill2 = skillService.addSkill("bob@test.com", skillReq2);
    }

    // ===== AUTH TESTS =====
    @Test
    void testRegisterAndLogin() {
        RegisterRequest request = new RegisterRequest("Charlie", "charlie@test.com", "pass456", "STUDENT");
        authService.register(request);

        User user = userRepository.findByEmail("charlie@test.com").orElseThrow();
        assertEquals("Charlie", user.getName());
        assertEquals(Role.STUDENT, user.getRole());
    }

    @Test
    void testLoginWithValidCredentials() {
        LoginRequest request = new LoginRequest();
        request.setEmail("alice@test.com");
        request.setPassword("password123");

        var response = authService.login(request);
        assertNotNull(response.getToken());
        assertTrue(response.getToken().length() > 0);
    }

    @Test
    void testLoginWithInvalidEmail() {
        LoginRequest request = new LoginRequest();
        request.setEmail("nonexistent@test.com");
        request.setPassword("password123");

        assertThrows(NotFoundException.class, () -> authService.login(request));
    }

    @Test
    void testLoginWithInvalidPassword() {
        LoginRequest request = new LoginRequest();
        request.setEmail("alice@test.com");
        request.setPassword("wrongpassword");

        assertThrows(BadRequestException.class, () -> authService.login(request));
    }

    @Test
    void testRegisterDuplicateEmail() {
        RegisterRequest request = new RegisterRequest("Diana", "alice@test.com", "pass789", "STUDENT");
        assertThrows(BadRequestException.class, () -> authService.register(request));
    }

    // ===== SKILL TESTS =====
    @Test
    void testAddSkill() {
        SkillRequest request = new SkillRequest();
        request.setName("Database Design");
        request.setType("OFFER");

        Skill skill = skillService.addSkill("alice@test.com", request);
        assertNotNull(skill.getId());
        assertEquals("Database Design", skill.getName());
        assertEquals("OFFER", skill.getType());
        assertEquals(student1.getId(), skill.getUser().getId());
    }

    @Test
    void testDeleteSkill() {
        SkillRequest request = new SkillRequest();
        request.setName("Temp Skill");
        request.setType("OFFER");

        Skill skill = skillService.addSkill("alice@test.com", request);
        skillService.deleteSkill(skill.getId(), "alice@test.com");

        Skill deleted = skillRepository.findById(skill.getId()).orElseThrow();
        assertFalse(deleted.isActive());
    }

    @Test
    void testDeleteSkillNotOwner() {
        assertThrows(
                com.skillswap.exception.custom.ForbiddenException.class,
                () -> skillService.deleteSkill(skill1.getId(), "bob@test.com")
        );
    }

    @Test
    void testDeleteSkillWithActiveSwaps() {
        // Create swap request
        SwapRequestCreateDto dto = new SwapRequestCreateDto();
        dto.skillId = skill1.getId();
        dto.offeredSkillId = skill2.getId();

        swapService.createSwapRequest("bob@test.com", dto);

        // Try to delete - should fail
        assertThrows(
                BadRequestException.class,
                () -> skillService.deleteSkill(skill1.getId(), "alice@test.com")
        );
    }

    // ===== SWAP TESTS =====
    @Test
    void testCreateSwapRequest() {
        SwapRequestCreateDto dto = new SwapRequestCreateDto();
        dto.skillId = skill1.getId();
        dto.offeredSkillId = skill2.getId();

        var response = swapService.createSwapRequest("bob@test.com", dto);
        assertNotNull(response.getId());
        assertEquals("bob@test.com", response.getSenderEmail());
        assertEquals("alice@test.com", response.getReceiverEmail());
        assertEquals(SwapStatus.PENDING, response.getStatus());
    }

    @Test
    void testSwapApprovalFlow() {
        // Create swap
        SwapRequestCreateDto dto = new SwapRequestCreateDto();
        dto.skillId = skill1.getId();
        dto.offeredSkillId = skill2.getId();

        var swapResponse = swapService.createSwapRequest("bob@test.com", dto);
        Long swapId = swapResponse.getId();

        // Accept swap
        var accepted = swapService.acceptSwap(swapId, "alice@test.com");
        assertEquals(SwapStatus.APPROVED, accepted.getStatus());

        // Verify skills are locked
        Skill lockedSkill1 = skillRepository.findById(skill1.getId()).orElseThrow();
        Skill lockedSkill2 = skillRepository.findById(skill2.getId()).orElseThrow();
        assertTrue(lockedSkill1.isLocked());
        assertTrue(lockedSkill2.isLocked());
    }

    @Test
    void testSwapRejectionFlow() {
        // Create swap
        SwapRequestCreateDto dto = new SwapRequestCreateDto();
        dto.skillId = skill1.getId();
        dto.offeredSkillId = skill2.getId();

        var swapResponse = swapService.createSwapRequest("bob@test.com", dto);
        Long swapId = swapResponse.getId();

        // Reject swap
        var rejected = swapService.rejectSwap(swapId, "alice@test.com");
        assertEquals(SwapStatus.REJECTED, rejected.getStatus());

        // Verify skills are NOT locked
        Skill skill1Check = skillRepository.findById(skill1.getId()).orElseThrow();
        Skill skill2Check = skillRepository.findById(skill2.getId()).orElseThrow();
        assertFalse(skill1Check.isLocked());
        assertFalse(skill2Check.isLocked());
    }

    @Test
    void testSwapOnlyReceiverCanAccept() {
        // Create swap
        SwapRequestCreateDto dto = new SwapRequestCreateDto();
        dto.skillId = skill1.getId();
        dto.offeredSkillId = skill2.getId();

        var swapResponse = swapService.createSwapRequest("bob@test.com", dto);
        Long swapId = swapResponse.getId();

        // Sender tries to accept - should fail
        assertThrows(
                com.skillswap.exception.custom.ForbiddenException.class,
                () -> swapService.acceptSwap(swapId, "bob@test.com")
        );
    }

    @Test
    void testCannotSwapInactiveSkill() {
        // Deactivate skill1
        skill1.setActive(false);
        skillRepository.save(skill1);

        SwapRequestCreateDto dto = new SwapRequestCreateDto();
        dto.skillId = skill1.getId();
        dto.offeredSkillId = skill2.getId();

        assertThrows(
                BadRequestException.class,
                () -> swapService.createSwapRequest("bob@test.com", dto)
        );
    }
}
