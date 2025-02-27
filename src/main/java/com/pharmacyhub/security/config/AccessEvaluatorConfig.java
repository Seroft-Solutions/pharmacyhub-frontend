package com.pharmacyhub.security.config;

import com.pharmacyhub.domain.repository.ExamAttemptRepository;
import com.pharmacyhub.domain.repository.ExamRepository;
import com.pharmacyhub.security.evaluator.ExamAccessEvaluator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class to explicitly register security evaluator beans.
 */
@Configuration
public class AccessEvaluatorConfig {

    /**
     * Explicitly register the examAccessEvaluator bean to ensure 
     * it is properly recognized by Spring Security for @PreAuthorize annotations.
     */
    @Bean(name = "examAccessEvaluator")
    public ExamAccessEvaluator examAccessEvaluator(
            ExamAttemptRepository examAttemptRepository,
            ExamRepository examRepository) {
        return new ExamAccessEvaluator(examAttemptRepository, examRepository);
    }
}
