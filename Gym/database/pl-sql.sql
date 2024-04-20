-- CURSOR

DELIMITER //

CREATE PROCEDURE CalculateTotalAmountPaid()
BEGIN
    DECLARE memberIdVar BIGINT UNSIGNED;
    DECLARE totalAmount DECIMAL(10, 2);
    
    -- Cursor to fetch member IDs
    DECLARE cur CURSOR FOR
        SELECT DISTINCT member_id FROM membership;
    
    -- Handler for cursor not found
    DECLARE CONTINUE HANDLER FOR NOT FOUND
        SET @done = TRUE;
    
    OPEN cur;
    
    read_loop: LOOP
        FETCH cur INTO memberIdVar;
        IF @done THEN
            LEAVE read_loop;
        END IF;
        
        -- Calculate total amount for each member
        SET totalAmount = (
            SELECT SUM(amount)
            FROM membership
            WHERE member_id = memberIdVar
        );
        
        -- Output result or perform further processing
        SELECT CONCAT('Member ID ', memberIdVar, ' Total Amount Paid: ', totalAmount) AS Result;
    END LOOP;
    
    CLOSE cur;
END //

DELIMITER ;



-- TRIGGER 
DELIMITER //

CREATE TRIGGER UpdateTotalAmountPaid
AFTER INSERT ON membership
FOR EACH ROW
BEGIN
    DECLARE totalAmount DECIMAL(10, 2);
    
    -- Calculate total amount paid by the member
    SET totalAmount = (
        SELECT SUM(amount)
        FROM membership
        WHERE member_id = NEW.member_id
    );
    
    -- Update the total amount in the members table
    UPDATE members
    SET total_amount_paid = totalAmount
    WHERE id = NEW.member_id;
END //

DELIMITER ;




-- PROCEDURE
DELIMITER //

CREATE PROCEDURE AddNewMember(
    IN fullNameVar VARCHAR(50),
    IN emailAddressVar VARCHAR(50),
    IN passwordVar DECIMAL(10, 0),
    IN planVar VARCHAR(255),
    IN amountVar DECIMAL(6, 0)
)
BEGIN
    DECLARE memberIdVar BIGINT UNSIGNED;
    
    -- Add member to members table
    INSERT INTO members (FullName, EmailAddress, password)
    VALUES (fullNameVar, emailAddressVar, passwordVar);
    
    -- Get the auto-generated member ID
    SET memberIdVar = LAST_INSERT_ID();
    
    -- Add membership details to membership table
    INSERT INTO membership (member_id, plan, amount)
    VALUES (memberIdVar, planVar, amountVar);
    
    SELECT CONCAT('New member added with ID: ', memberIdVar) AS Result;
END //

DELIMITER ;



--ERROR HANDLING 
DELIMITER //

CREATE PROCEDURE AddNewMemberWithCheck(
    IN fullNameVar VARCHAR(50),
    IN emailAddressVar VARCHAR(50),
    IN passwordVar DECIMAL(10, 0),
    IN planVar VARCHAR(255),
    IN amountVar DECIMAL(6, 0)
)
BEGIN
    DECLARE memberIdVar BIGINT UNSIGNED;
    
    -- Check if email address already exists
    IF EXISTS (SELECT 1 FROM members WHERE EmailAddress = emailAddressVar) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: Email address already exists';
    ELSE
        -- Add member to members table
        INSERT INTO members (FullName, EmailAddress, password)
        VALUES (fullNameVar, emailAddressVar, passwordVar);
        
        -- Get the auto-generated member ID
        SET memberIdVar = LAST_INSERT_ID();
        
        -- Add membership details to membership table
        INSERT INTO membership (member_id, plan, amount)
        VALUES (memberIdVar, planVar, amountVar);
        
        SELECT CONCAT('New member added with ID: ', memberIdVar) AS Result;
    END IF;
END //

DELIMITER ;


--FUNCTION
DELIMITER //

CREATE FUNCTION CalculateTotalAmountPaid(memberIdVar BIGINT UNSIGNED)
RETURNS DECIMAL(10, 2)
BEGIN
    DECLARE totalAmount DECIMAL(10, 2);
    
    -- Calculate total amount paid by the member
    SELECT SUM(amount) INTO totalAmount
    FROM membership
    WHERE member_id = memberIdVar;
    
    RETURN totalAmount;
END //

DELIMITER ;



CALL CalculateTotalAmountPaid();
CALL AddNewMember('Keshav Agrawal','kesh@gmail',123,'Basic Plan',1000);
CALL AddNewMemberWithCheck('Jane Smith', 'jane@gym.com', 11, 'Premium Plan', 1500);
SELECT CalculateTotalAmountPaid(id) AS TotalAmountPaid FROM members where id=59;




DROP PROCEDURE IF EXISTS CalculateTotalAmountPaid;
DROP PROCEDURE IF EXISTS AddNewMember;
DROP FUNCTION IF EXISTS CalculateTotalAmountPaid;
DROP TRIGGER IF EXISTS UpdateTotalAmountPaid;