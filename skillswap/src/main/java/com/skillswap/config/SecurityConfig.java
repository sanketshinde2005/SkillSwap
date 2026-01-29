package com.skillswap.config;

import com.skillswap.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter, CorsConfigurationSource corsConfigurationSource) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .sessionManagement(session
                        -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth
                // Swagger
                .requestMatchers(
                        "/v3/api-docs/**",
                        "/swagger-ui/**",
                        "/swagger-ui.html"
                ).permitAll()
                // Preflight
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // Auth
                .requestMatchers("/api/auth/**").permitAll()
                // Skills
                .requestMatchers("/api/skills/**").authenticated()
                // Swaps — STUDENT
                .requestMatchers(HttpMethod.POST, "/api/swaps")
                .hasAuthority("ROLE_STUDENT")
                .requestMatchers(HttpMethod.GET, "/api/swaps/incoming")
                .hasAuthority("ROLE_STUDENT")
                .requestMatchers(HttpMethod.GET, "/api/swaps/outgoing")
                .hasAuthority("ROLE_STUDENT")
                .requestMatchers(HttpMethod.GET, "/api/swaps/requested-skills")
                .hasAuthority("ROLE_STUDENT")
                .requestMatchers(HttpMethod.DELETE, "/api/swaps/**")
                .hasAuthority("ROLE_STUDENT")
                // Swaps — ADMIN
                .requestMatchers(HttpMethod.GET, "/api/swaps")
                .hasAuthority("ROLE_ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/swaps/**")
                .hasAuthority("ROLE_ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/skills/**").hasAuthority("ROLE_STUDENT")
                .anyRequest().authenticated()
                );

        return http.build();
    }

}
