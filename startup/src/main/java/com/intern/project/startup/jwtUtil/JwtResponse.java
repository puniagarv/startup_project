package com.intern.project.startup.jwtUtil;

import lombok.*;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JwtResponse {
    String jwtToken;
    String userName;
}