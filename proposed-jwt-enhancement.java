// Proposed enhancement to JwtHelper.java
private String doGenerateToken(Map<String, Object> claims, String subject) {
    // Get user roles and permissions
    User user = userRepository.findByEmailAddress(subject)
        .orElseThrow(() -> new UsernameNotFoundException("User not found: " + subject));
    
    // Add roles and permissions to claims
    Set<String> roleNames = user.getRoles().stream()
        .map(role -> role.getName())
        .collect(Collectors.toSet());
    claims.put("roles", roleNames);
    
    // Add authorities (including permissions) for Spring Security format
    Set<String> authorities = new HashSet<>();
    
    // Add role-based authorities (ROLE_XXX format for Spring Security)
    roleNames.forEach(role -> authorities.add("ROLE_" + role));
    
    // Add permissions
    Set<Permission> permissions = rbacService.getUserEffectivePermissions(user.getId());
    permissions.forEach(permission -> authorities.add(permission.getName()));
    
    claims.put("authorities", authorities);
    
    // Create token with enhanced claims
    return Jwts.builder()
        .setClaims(claims)
        .setSubject(subject)
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY * 1000))
        .signWith(SignatureAlgorithm.HS512, secret)
        .compact();
}