# UniBoard baseline snapshot

## Auth and roles
- JWT-based authentication is used in the backend.
- Auth middleware validates the bearer token and loads the user by id.
- Roles currently supported by the Prisma schema: STUDENT, LANDLORD, ADMIN, MANAGER, AGENT.
- Login rejects inactive or non-existent users and requires status ACTIVE.
- Signup creates students as ACTIVE and landlords as PENDING until admin approval.
- Admin approval is handled through /api/admin/users/:id/approve and /api/admin/users/:id/reject.

## Backend routes and responsibilities
- /api/auth/login and /api/auth/signup handle authentication.
- /api/admin/* handles admin user listing and approval/rejection.
- /api/landlord/overview, /api/landlord/properties provide landlord dashboard functionality.
- /api/properties and /api/search expose property listing/search behavior.

## Core data model
- User: stores auth identity, role, status, adminLevel, contact info, compoundName, and nrcImages.
- Compound: represents a landlord business/compound and links to a user.
- Building: groups a property type under a compound.
- Property: represents a listed accommodation unit.
- Review, Feature, PropertyImage, BuildingImage, ManagerAgent, OtpVerification support the platform flows.

## Current approval and access logic
- Auth middleware enforces token validity and active status.
- isAdmin allows ADMIN only.
- isSuperAdmin requires ADMIN plus adminLevel SUPER.
- isLandlord allows LANDLORD only.
- isLandlordOrManager allows LANDLORD or MANAGER.

## Current known constraints
- Local auth flow depends on a working DATABASE_URL and SMTP configuration.
- Signup currently fails if the email address already exists in the database.
- Email delivery is non-blocking locally when SMTP credentials are absent.
